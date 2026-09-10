import next from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...next,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "scripts/.shots/**"],
  },
];

export default config;
