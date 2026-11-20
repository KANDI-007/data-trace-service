import fs from "fs";
import path from "path";
import { createRequire } from "module";

const directories = [
  "dist/compiled/source-map",
  "dist/compiled/stacktrace-parser",
  "dist/compiled/hash.js",
  "dist/compiled/ws",
  "dist/compiled/babel-code-frame",
];

function resolveFile(base) {
  const candidates = [base, `${base}.js`, `${base}.mjs`, `${base}.cjs`, path.join(base, "index.js"), path.join(base, "index.mjs")];
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

export function runtimeFiles(nextRoot) {
  const start = path.join(nextRoot, "dist/compiled/next-server/server.runtime.prod.js");
  const bundleRe = /require\((?:'|")([^'"]+)(?:'|")\)|import\((?:'|")([^'"]+)(?:'|")\)/g;
  const anyRe = /require\((?:'|")(\.[^'"]+|next\/dist\/[^'"]+)(?:'|")\)|import\((?:'|")(\.[^'"]+|next\/dist\/[^'"]+)(?:'|")\)/g;
  const seen = new Set();
  const queue = [start];
  const files = new Set();
  const fromNext = createRequire(path.join(nextRoot, "package.json"));
  try {
    files.add(fromNext.resolve("styled-jsx/package.json"));
  } catch {
    // styled-jsx is optional only when the server bundle stops resolving it
  }

  for (const directory of directories) {
    const absolute = path.join(nextRoot, directory);
    if (!fs.existsSync(absolute)) continue;
    for (const entry of fs.readdirSync(absolute, { recursive: true })) {
      const file = path.join(absolute, entry.toString());
      if (fs.statSync(file).isFile()) files.add(file);
    }
  }

  while (queue.length) {
    const file = queue.pop();
    if (!file || seen.has(file)) continue;
    seen.add(file);
    let text = "";
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const pattern = file.endsWith(`${path.sep}server.runtime.prod.js`) ? bundleRe : anyRe;
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text))) {
      const spec = match[1] || match[2];
      if (spec.startsWith("node:")) continue;
      const base = spec.startsWith(".")
        ? path.resolve(path.dirname(file), spec)
        : spec.startsWith("next/")
          ? path.join(nextRoot, spec.replace(/^next\//, ""))
          : null;
      let hit = base ? resolveFile(base) : null;
      if (!hit && !spec.startsWith(".") && !spec.startsWith("next/")) {
        try {
          hit = fromNext.resolve(spec);
        } catch {
          hit = null;
        }
      }
      if (!hit || hit.includes(`${path.sep}node_modules${path.sep}next${path.sep}dist${path.sep}compiled${path.sep}next-server${path.sep}`)) continue;
      if (!hit.includes(`${path.sep}node_modules${path.sep}`)) continue;
      files.add(hit);
      queue.push(hit);
    }
  }

  return [...files];
}
