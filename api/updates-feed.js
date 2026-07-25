// Public update feed. Chotu fetches this with no credentials — the hub's
// manifest fetch is a plain GET — so this route must stay unauthenticated.
//
// Handing out the release manifest is safe: it carries a version, a sha256, and
// an Ed25519 signature over those, and the app refuses any package whose bytes
// do not match the signed digest. What it must NOT carry is a permanent download
// link, so the stored manifest holds no URL and this route injects a short-lived
// presigned one on every request. The signature covers version, channel,
// platform, sha256 and size — deliberately not the URL — so rotating links never
// invalidate it.

import {
  presignArtifactUrl,
  r2Client,
  r2Config,
  r2KeyForArtifact,
  readR2Text,
} from './_r2.js';

const MANIFEST_SCHEMA = 'chotu.update_manifest.v1';
const DOWNLOAD_TTL_SECONDS = 3600;

// One manifest per platform, stored next to the artifacts it describes.
const PLATFORMS = new Map([
  [
    'darwin-arm64',
    { manifest: 'chotu-darwin-arm64.update.json', pkg: 'chotu-darwin-arm64.zip', installer: 'chotu-darwin-arm64.dmg' },
  ],
]);

export function parseTarget({ channel, platform }) {
  // `/api/updates/stable/darwin-arm64.json` is baked into shipped apps and cannot
  // be corrected later, so vercel.json rewrites it here explicitly rather than
  // relying on catch-all params and on a dotted final segment not being treated
  // as a static file.
  const channelName = String(channel || '').trim();
  const platformName = String(platform || '').trim().replace(/\.json$/i, '');
  if (!/^[a-z0-9-]+$/i.test(channelName)) return null;
  const target = PLATFORMS.get(platformName);
  if (!target) return null;
  return { channel: channelName, platform: platformName, ...target };
}

function targetFromRequest(req) {
  const query = req.query || {};
  if (query.channel && query.platform) {
    return parseTarget({ channel: query.channel, platform: query.platform });
  }
  // Direct hit without the rewrite (or a local run): read the path itself.
  const path = String(req.url || '').split('?')[0];
  const marker = '/api/updates/';
  const index = path.indexOf(marker);
  if (index === -1) return null;
  const parts = path.slice(index + marker.length).split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  return parseTarget({ channel: parts[0], platform: parts[1] });
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const target = targetFromRequest(req);
  if (!target) return res.status(404).json({ error: 'Unknown update channel or platform' });

  try {
    const config = r2Config();
    const client = r2Client(config);

    let manifest;
    try {
      manifest = JSON.parse(await readR2Text(client, config, r2KeyForArtifact(target.manifest)));
    } catch {
      // No manifest published yet is a normal state, not a server fault: the app
      // treats a failed check as "no update" and carries on.
      return res.status(404).json({ error: 'No update has been published for this platform yet' });
    }

    if (manifest?.schema_version !== MANIFEST_SCHEMA) {
      return res.status(502).json({ error: 'Stored update manifest uses an unsupported format' });
    }

    const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
    const resolved = [];
    for (const asset of assets) {
      if (asset?.platform !== target.platform) continue;
      const url = await presignArtifactUrl(client, config, target.pkg, DOWNLOAD_TTL_SECONDS);
      const next = { ...asset, url };
      if (asset.installer) {
        next.installer = {
          ...asset.installer,
          url: await presignArtifactUrl(client, config, target.installer, DOWNLOAD_TTL_SECONDS),
        };
      }
      resolved.push(next);
    }

    if (!resolved.length) {
      return res.status(404).json({ error: 'No update asset for this platform' });
    }

    // Short cache: a stale manifest would hand out an expired download link.
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).json({ ...manifest, channel: manifest.channel || target.channel, assets: resolved });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Update feed is unavailable' });
  }
}
