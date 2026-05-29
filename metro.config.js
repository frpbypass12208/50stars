const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

// ─── Patch @babel/traverse visitors.js ───────────────────────────────────────
// Fix: "Cannot use 'in' operator to search for 'FunctionParent' in undefined"
// Root cause: @babel/traverse 7.23.x passes undefined visitors to explode().
// We guard the two call-sites that can receive a non-object visitor.
(function patchBabelTraverse() {
  try {
    const visitorsFile = path.join(
      __dirname,
      'node_modules/@babel/traverse/lib/visitors.js'
    );
    if (!fs.existsSync(visitorsFile)) return;

    let src = fs.readFileSync(visitorsFile, 'utf8');

    // Guard 1 – explode() entry check
    const guard1From = `function explode(visitor) {`;
    const guard1To =
      `function explode(visitor) {\n  if (!visitor || typeof visitor !== 'object') return visitor || {};`;

    // Guard 2 – environmentVisitor merge call (line ~249)
    const guard2From = `return merge([...visitors]);`;
    const guard2To =
      `return merge([...visitors].filter(v => v && typeof v === 'object'));`;

    let patched = false;
    if (!src.includes('// @onspace-patched')) {
      src = src
        .replace(guard1From, guard1To)
        .replace(guard2From, guard2To);
      src = '// @onspace-patched\n' + src;
      fs.writeFileSync(visitorsFile, src, 'utf8');
      patched = true;
    }
    if (patched) console.log('[metro] @babel/traverse visitors.js patched.');
  } catch (e) {
    console.warn('[metro] Could not patch @babel/traverse:', e.message);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

const config = getDefaultConfig(__dirname);

module.exports = config;
