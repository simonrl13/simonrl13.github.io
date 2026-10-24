import { test } from "node:test";
import assert from "node:assert/strict";
import { latestSuccess } from "./prod-deploy.mjs";

const states = { 3: "in_progress", 2: "success", 1: "success" };
const latestState = async (d) => states[d.id];

test("skips a newer deploy still building; the newest success wins", async () => {
  assert.equal(await latestSuccess([{ id: 3, sha: "c" }, { id: 2, sha: "b" }, { id: 1, sha: "a" }], latestState), "b");
});

test("nothing successful → null", async () => {
  assert.equal(await latestSuccess([{ id: 3, sha: "c" }], latestState), null);
});
