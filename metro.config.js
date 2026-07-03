const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

// ─── Patch @babel/traverse visitors.js ───────────────────────────────────────
// Fix: "Cannot use 'in' operator to search for 'FunctionParent' in undefined"
// Root cause: @babel/traverse 7.23.x passes undefined visitors to explode().
// We resolve the real file path via require.resolve (works with pnpm's virtual
// store) so the patch is actually written to the correct location.
(function patchBabelTraverse() {
  try {
    // Resolve the actual on-disk location (handles pnpm/yarn PnP/hoisted)
    const traverseEntry = require.resolve('@babel/traverse');
    const visitorsFile = path.join(path.dirname(traverseEntry), 'visitors.js');

    if (!fs.existsSync(visitorsFile)) {
      console.warn('[metro] @babel/traverse visitors.js not found at:', visitorsFile);
      return;
    }

    let src = fs.readFileSync(visitorsFile, 'utf8');

    if (src.includes('// @onspace-patched')) {
      // Already patched – nothing to do
      return;
    }

    // Guard 1 – explode() entry: return early for non-object visitors
    src = src.replace(
      /function explode\(visitor\)\s*\{/,
      `function explode(visitor) {\n  if (!visitor || typeof visitor !== 'object') return visitor || {};`
    );

    // Guard 2 – filter undefined values before merge in environmentVisitor
    src = src.replace(
      /return merge\(\[\.\.\.visitors\]\)/,
      `return merge([...visitors].filter(v => v != null && typeof v === 'object'))`
    );

    src = '// @onspace-patched\n' + src;
    fs.writeFileSync(visitorsFile, src, 'utf8');
    console.log('[metro] @babel/traverse visitors.js patched successfully.');
  } catch (e) {
    console.warn('[metro] Could not patch @babel/traverse:', e.message);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────

const config = getDefaultConfig(__dirname);

module.exports = config;
