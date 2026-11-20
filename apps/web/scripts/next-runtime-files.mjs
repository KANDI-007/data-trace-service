import fs from "fs";
import path from "path";

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
  const bundleRe = /require\((?:'|")(next\/dist\/[^'"]+)(?:'|")\)|import\((?:'|")(next\/dist\/[^'"]+)(?:'|")\)/g;
  const anyRe = /require\((?:'|")(\.[^'"]+|next\/dist\/[^'"]+)(?:'|")\)|import\((?:'|")(\.[^'"]+|next\/dist\/[^'"]+)(?:'|")\)/g;
  const seen = new Set();
  const queue = [start];
  const files = new Set();

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
      const base = spec.startsWith(".")
        ? path.resolve(path.dirname(file), spec)
        : path.join(nextRoot, spec.replace(/^next\//, ""));
      const hit = resolveFile(base);
      if (!hit || !hit.startsWith(nextRoot)) continue;
      files.add(hit);
      queue.push(hit);
    }
  }

  return [...files];
}
