import { desktopLicensePublicKeyPem } from './_desktop-license.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method not allowed');
  }

  try {
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(desktopLicensePublicKeyPem());
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).send('Desktop license public key is not configured');
  }
}
