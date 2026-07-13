import assert from 'node:assert/strict';
import test from 'node:test';

import { validateLoopbackCallback } from './create-desktop-login-token.js';


test('desktop managed-key delivery is pinned to Chotu fixed loopback callback', () => {
  assert.equal(
    validateLoopbackCallback('http://127.0.0.1:7777/v1/auth/browser-callback').toString(),
    'http://127.0.0.1:7777/v1/auth/browser-callback',
  );
});


for (const callback of [
  'http://127.0.0.1:7778/v1/auth/browser-callback',
  'http://localhost:7777/v1/auth/browser-callback',
  'http://127.0.0.1:7777/v1/auth/browser-callback?license_token=secret',
  'http://127.0.0.1:7777/v1/auth/browser-callback#secret',
  'https://127.0.0.1:7777/v1/auth/browser-callback',
]) {
  test(`desktop managed-key delivery rejects ${callback}`, () => {
    assert.throws(
      () => validateLoopbackCallback(callback),
      (error) => error.statusCode === 400 && error.message === 'Invalid Chotu Desktop callback URL',
    );
  });
}
