// Fails the production build while any [placeholder] text is left in src/content.js.
import content, { findPlaceholders } from "../src/content.js";

const left = findPlaceholders(content);
if (left.length) {
  console.error(`\nBuild stopped: ${left.length} placeholder(s) left in src/content.js:\n`);
  left.forEach((p) => console.error(`  ${p.path}: ${p.text}`));
  console.error('\nFill them in. For a test build only, run "npm run build:draft".\n');
  process.exit(1);
}
console.log("Placeholder check passed.");
