import assert from 'node:assert/strict';
import test from 'node:test';

import { productForArtifact, r2KeyForArtifact, releasePrefix } from './_r2.js';

test('each product s artifacts land under its own prefix', () => {
  // A shared prefix would let a Manu release overwrite a Chotu one of the same
  // name, and hand Chotu installs a Manu package.
  assert.notEqual(releasePrefix('chotu'), releasePrefix('manu'));
  assert.match(r2KeyForArtifact('chotu-darwin-arm64.zip'), /^chotu\//);
  assert.match(r2KeyForArtifact('manu-darwin-arm64.zip'), /^manu\//);
});

test('the product is read from the artifact name, so upload and read cannot disagree', () => {
  assert.equal(productForArtifact('manu-darwin-arm64.update.json'), 'manu');
  assert.equal(productForArtifact('chotu-darwin-arm64.dmg'), 'chotu');
});

test('an unrecognised artifact name is treated as Chotu rather than escaping the prefix', () => {
  // Only names in the presigner's allowlist ever reach here; this pins the
  // behaviour so a future name cannot silently write outside a product prefix.
  assert.equal(productForArtifact('mystery.zip'), 'chotu');
  assert.equal(productForArtifact(''), 'chotu');
});
