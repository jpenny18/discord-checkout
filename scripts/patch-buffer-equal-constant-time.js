/**
 * Node.js 25 removed buffer.SlowBuffer. buffer-equal-constant-time@1.0.1
 * reads SlowBuffer.prototype while the module is loading, which crashes
 * `next build` ("Collecting page data") as soon as an API route imports
 * firebase-admin -> jsonwebtoken -> jwa.
 *
 * jwa calls the exported constant-time compare. It does not use the optional
 * Buffer.prototype.equal patch. When SlowBuffer is missing, alias it to
 * Buffer so that prototype read succeeds and the compare function is unchanged.
 */
const fs = require('fs');
const path = require('path');

const NEEDLE = "var SlowBuffer = require('buffer').SlowBuffer;";
const MARKER = 'SlowBuffer was removed in Node.js 25';
const REPLACEMENT = `${NEEDLE}
// ${MARKER}. jsonwebtoken/jwa only needs the exported compare.
if (typeof SlowBuffer === 'undefined') {
  SlowBuffer = Buffer;
}
`;

function findPackageIndexes(dir, depth, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;

    if (entry.name === 'buffer-equal-constant-time') {
      const indexPath = path.join(full, 'index.js');
      if (fs.existsSync(indexPath)) out.push(indexPath);
      continue;
    }

    // Top level: look inside each package. Deeper: only nested node_modules.
    if (depth === 0 || entry.name === 'node_modules') {
      findPackageIndexes(full, depth + 1, out);
    }
  }
}

function patchFile(file) {
  const source = fs.readFileSync(file, 'utf8');
  if (source.includes(MARKER)) {
    console.log(`already patched ${file}`);
    return;
  }
  if (!source.includes(NEEDLE)) {
    console.warn(`skipped ${file}: unexpected buffer-equal-constant-time source`);
    return;
  }
  fs.writeFileSync(file, source.replace(NEEDLE, REPLACEMENT));
  console.log(`patched ${file}`);
}

const nodeModules = path.join(__dirname, '..', 'node_modules');
const indexes = [];
findPackageIndexes(nodeModules, 0, indexes);

if (indexes.length === 0) {
  console.log('buffer-equal-constant-time is not installed; nothing to patch');
  process.exit(0);
}

for (const file of indexes) {
  patchFile(file);
}
