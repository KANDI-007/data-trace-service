import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const nextRoot = path.dirname(require.resolve("next/package.json"));
const destRoot = path.join(process.cwd(), "traced-runtime", "next");
const items = [
  "dist/compiled/source-map",
  "dist/compiled/stacktrace-parser",
  "dist/compiled/ws",
  "dist/compiled/babel/code-frame.js",
];

for (const item of items) {
  const from = path.join(nextRoot, item);
  const to = path.join(destRoot, item);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
}

console.log(`staged Next runtime files in ${path.relative(process.cwd(), destRoot)}`);
