import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { runtimeFiles } from "./next-runtime-files.mjs";

const require = createRequire(path.join(process.cwd(), "package.json"));
const nextRoot = path.dirname(require.resolve("next/package.json"));
const destRoot = path.join(process.cwd(), "traced-runtime", "next");

fs.rmSync(path.join(process.cwd(), "traced-runtime"), { recursive: true, force: true });
const files = runtimeFiles(nextRoot);
for (const file of files) {
  const relative = path.relative(nextRoot, file);
  const target = path.join(destRoot, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
}

console.log(`staged ${files.length} Next runtime files`);
