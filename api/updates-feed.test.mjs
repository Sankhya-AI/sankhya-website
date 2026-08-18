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

test('a URL with no product still means Chotu, so shipped installs are unaffected', () => {
  // Chotu 0.1.x bakes a two-segment path. If the product segment became required,
  // every install already in customers' hands would stop seeing updates.
  assert.equal(parseTarget({ channel: 'stable', platform: 'darwin-arm64.json' }).product, 'chotu');
});

test('Manu is served its own manifest, never Chotu s', () => {
  // Manu and Chotu are sold separately. Serving Chotu's manifest here would offer
  // an advocate a build that replaces their app with a different product.
  const target = parseTarget({ product: 'manu', channel: 'stable', platform: 'darwin-arm64' });
  assert.equal(target.product, 'manu');
  assert.equal(target.manifest, 'manu-darwin-arm64.update.json');
  assert.equal(target.pkg, 'manu-darwin-arm64.zip');
  assert.equal(target.installer, 'manu-darwin-arm64.dmg');
});

test('Plank is served its own release channel, never Chotu s', () => {
  const target = parseTarget({ product: 'plank', channel: 'stable', platform: 'darwin-arm64' });
  assert.equal(target.product, 'plank');
  assert.equal(target.manifest, 'plank-darwin-arm64.update.json');
  assert.equal(target.pkg, 'plank-darwin-arm64.zip');
  assert.equal(target.installer, 'plank-darwin-arm64.dmg');
});

test('an unknown product is refused rather than falling back to Chotu', () => {
  assert.equal(parseTarget({ product: 'evil', channel: 'stable', platform: 'darwin-arm64' }), null);
  assert.equal(parseTarget({ product: '../chotu', channel: 'stable', platform: 'darwin-arm64' }), null);
});
