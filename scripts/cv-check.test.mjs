import { test } from "node:test";
import assert from "node:assert/strict";
import { facts, compareTrios } from "./cv-check.mjs";

test("the same facts written three ways are equal", () => {
  const en = facts("8,190 players; MAE 0.357; ~13% lower; Jun 2022 – Jun 2023; 2024 – present; 23/25", "en");
  assert.deepEqual(facts("8 190 joueurs ; MAE 0,357 ; environ 13 % ; juin 2022 – juin 2023 ; 2024 – aujourd’hui ; 23/25", "fr"), en);
  assert.deepEqual(facts("8.190 jogadores; MAE 0,357; cerca de 13%; jun. 2022 – jun. 2023; 2024 – atual; 23/25", "pt-BR"), en);
});

test("a changed number, month or year is caught", () => {
  const trio = (fr, pt) => compareTrios([{ en: "92% (23/25 terms), Aug 2026", fr, "pt-BR": pt }]);
  assert.equal(trio("92 % (23/25 termes), août 2026", "92% (23/25 termos), ago. 2026").length, 0);
  assert.equal(trio("91 % (23/25 termes), août 2026", "92% (23/25 termos), ago. 2026").length, 1);
  assert.equal(trio("92 % (23/25 termes), juillet 2026", "92% (23/25 termos), ago. 2026").length, 1);
  assert.equal(trio("92 % (23/25 termes), août 2026", "92% (23/25 termos), ago. 2025").length, 1);
});

test("words that look like months only count before a year; an incomplete trio fails", () => {
  assert.deepEqual(facts("Market-Value Forecasting", "en"), []);
  assert.equal(compareTrios([{ en: "Remote", fr: "À distance" }]).length, 1);
});
