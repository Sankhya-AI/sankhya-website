import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLoopbackCallback } from './create-desktop-login-token.js';


// The licence token — and the account's managed key inside it — is POSTed to whatever
// URL this returns. So the test that matters is not that the two known apps pass; it
// is that nothing else does.
test('each desktop app is recognised by the loopback port its hub listens on', () => {
  const chotu = validateLoopbackCallback('http://127.0.0.1:7777/v1/auth/browser-callback');
  assert.equal(chotu.url.toString(), 'http://127.0.0.1:7777/v1/auth/browser-callback');
  assert.equal(chotu.product, 'chotu');

  const manu = validateLoopbackCallback('http://127.0.0.1:8787/v1/auth/browser-callback');
  assert.equal(manu.url.toString(), 'http://127.0.0.1:8787/v1/auth/browser-callback');
  assert.equal(manu.product, 'manu');

  const plank = validateLoopbackCallback('http://127.0.0.1:9797/v1/auth/browser-callback');
  assert.equal(plank.url.toString(), 'http://127.0.0.1:9797/v1/auth/browser-callback');
  assert.equal(plank.product, 'plank');
});


test('an app that names no callback is Chotu, as every shipped build has been', () => {
  assert.equal(validateLoopbackCallback(undefined).product, 'chotu');
});


for (const callback of [
  'http://127.0.0.1:7778/v1/auth/browser-callback',
  'http://127.0.0.1:8788/v1/auth/browser-callback',
  'http://127.0.0.1:9798/v1/auth/browser-callback',
  'http://localhost:7777/v1/auth/browser-callback',
  'http://localhost:8787/v1/auth/browser-callback',
  'http://localhost:9797/v1/auth/browser-callback',
  'http://127.0.0.1:7777/v1/auth/browser-callback?license_token=secret',
  'http://127.0.0.1:8787/v1/auth/browser-callback?license_token=secret',
  'http://127.0.0.1:7777/v1/auth/browser-callback#secret',
  'https://127.0.0.1:7777/v1/auth/browser-callback',
  'http://127.0.0.1:8787/v1/auth/browser-callback/../../steal',
]) {
  test(`desktop managed-key delivery rejects ${callback}`, () => {
    assert.throws(
      () => validateLoopbackCallback(callback),
      (error) => error.statusCode === 400 && error.message === 'Invalid desktop callback URL',
    );
  });
}
