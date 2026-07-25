import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTarget } from './updates-feed.js';

test('the feed accepts the URL that is baked into shipped apps', () => {
  // This exact path ships inside every build as CHOTU_UPDATE_FEED_URL. If it
  // stops resolving, installed apps silently stop seeing updates and the only
  // remedy is asking every customer to download a DMG by hand.
  const target = parseTarget({ channel: 'stable', platform: 'darwin-arm64.json' });
  assert.equal(target.channel, 'stable');
  assert.equal(target.platform, 'darwin-arm64');
  assert.equal(target.pkg, 'chotu-darwin-arm64.zip');
  assert.equal(target.installer, 'chotu-darwin-arm64.dmg');
  assert.equal(target.manifest, 'chotu-darwin-arm64.update.json');
});

test('the .json suffix is optional', () => {
  assert.equal(parseTarget({ channel: 'stable', platform: 'darwin-arm64' }).platform, 'darwin-arm64');
});

test('unknown platforms and channels are refused, not guessed', () => {
  assert.equal(parseTarget({ channel: 'stable', platform: 'win32-x64' }), null);
  assert.equal(parseTarget({ channel: '', platform: 'darwin-arm64' }), null);
  assert.equal(parseTarget({ channel: '../secrets', platform: 'darwin-arm64' }), null);
});
