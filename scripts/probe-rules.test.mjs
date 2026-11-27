/* Unit tests for the probe rules in scripts/probe-rules.mjs. Run: npm test. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { releaseClaims, retrievalHits, startDateHits } from "./probe-rules.mjs";

test("NutriQuest: 'available on request' is the status, an app store is a claim", () => {
  assert.deepEqual(releaseClaims("A demo is available on request, so you can contact Simon at simonrl865@gmail.com."), []);
  assert.equal(releaseClaims("NutriQuest is available on the App Store.").length, 1);
  assert.equal(releaseClaims("NutriQuest is available on Google Play.").length, 1);
  assert.equal(releaseClaims("O NutriQuest está disponível na App Store.").length, 1);
  assert.equal(releaseClaims("NutriQuest est disponible sur Google Play.").length, 1);
  assert.deepEqual(releaseClaims("No, NutriQuest is not available on the App Store or Google Play."), [], "a negated sentence is no claim");
});

test("start date: February 2027 only, never earlier or now", () => {
  assert.deepEqual(startDateHits("He is available to start from February 2027."), []);
  assert.deepEqual(startDateHits("He isn't available right now; he can start in February 2027."), [], "a negated 'now' is fine");
  assert.ok(startDateHits("He can start immediately.").length > 0);
  assert.ok(startDateHits("He can start now, and fully from February 2027.").length > 0);
  assert.ok(startDateHits("He is available from January 2027.").length > 0);
  assert.ok(startDateHits("He could start in December 2026.").length > 0);
});

test("Scout retrieval: keyword stays the default, hybrid never is", () => {
  assert.deepEqual(retrievalHits("Hybrid search with reranking lifted hits@1 from 0.52 to 0.91, but it missed the latency budget, so keyword search stays the default and the live demo uses it."), []);
  assert.ok(retrievalHits("The demo now uses hybrid search with reranking.").length > 0);
  assert.ok(retrievalHits("Hybrid search won, so it is the default now.").length > 0, "no keyword at all");
  assert.deepEqual(retrievalHits("The demo does not use hybrid search; keyword search is still the default."), []);
});
