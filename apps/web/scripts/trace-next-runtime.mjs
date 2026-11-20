import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(path.join(process.cwd(), "package.json"));
const nextRoot = path.dirname(require.resolve("next/package.json"));
const wanted = [
  "dist/compiled/source-map",
  "dist/compiled/stacktrace-parser",
  "dist/compiled/ws",
  "dist/compiled/babel/code-frame.js",
  "dist/compiled/babel-code-frame",
];

function filesUnder(target) {
  const absolute = path.join(nextRoot, target);
  if (!fs.existsSync(absolute)) return [];
  if (fs.statSync(absolute).isFile()) return [absolute];
  return fs.readdirSync(absolute, { recursive: true }).flatMap((entry) => {
    const file = path.join(absolute, entry.toString());
    return fs.statSync(file).isFile() ? [file] : [];
  });
}

const extras = wanted.flatMap(filesUnder);
const traces = [
  path.join(process.cwd(), ".next", "next-minimal-server.js.nft.json"),
  path.join(process.cwd(), ".next", "next-server.js.nft.json"),
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".nft.json")) traces.push(full);
  }
}

walk(path.join(process.cwd(), ".next", "server"));

for (const trace of traces) {
  if (!fs.existsSync(trace)) continue;
  const data = JSON.parse(fs.readFileSync(trace, "utf8"));
  const base = path.dirname(trace);
  const present = new Set(data.files);
  for (const file of extras) {
    present.add(path.relative(base, file).replace(/\\/g, "/"));
  }
  data.files = [...present];
  fs.writeFileSync(trace, JSON.stringify(data));
}

console.log(`traced ${extras.length} Next runtime files into ${traces.length} functions`);
