/* The CI wait script decides only from completed runs. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { verdict } from "./ci-wait.mjs";

const run = (id, name, status, conclusion = null) => ({ id, name, status, conclusion });
const green = [run(1, "verify", "completed", "success"), run(2, "secret-scan", "completed", "success"), run(3, "codeql", "completed", "success")];

test("all required checks completed and green → ok", () => {
  assert.deepEqual(verdict(green).done, true);
  assert.equal(verdict(green).ok, true);
});

test("a run still in progress → not done, never a result", () => {
  const v = verdict([...green.slice(0, 2), run(3, "codeql", "in_progress")]);
  assert.equal(v.done, false);
  assert.deepEqual(v.pending, ["codeql (in_progress)"]);
});

test("no runs yet (e.g. no data from the API) → not done", () => {
  const v = verdict([]);
  assert.equal(v.done, false);
  assert.deepEqual(v.pending, ["verify (not started)", "secret-scan (not started)", "codeql (not started)"]);
});

test("an optional check still queued holds the report back", () => {
  assert.equal(verdict([...green, run(4, "Vercel Preview Comments", "queued")]).done, false);
});

test("a failed check, required or not → done, not ok, named", () => {
  const v = verdict([...green, run(4, "CodeQL", "completed", "failure")]);
  assert.equal(v.done, true);
  assert.equal(v.ok, false);
  assert.deepEqual(v.failed, ["CodeQL: failure"]);
});

test("neutral and skipped don't fail; a re-run's latest conclusion wins", () => {
  const v = verdict([run(0, "verify", "completed", "failure"), ...green, run(4, "Vercel", "completed", "neutral"), run(5, "x", "completed", "skipped")]);
  assert.equal(v.ok, true);
  assert.equal(verdict([...green, run(10, "verify", "completed", "cancelled")]).ok, false);
});
