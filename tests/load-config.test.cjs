const assert = require('node:assert/strict');
const path = require('node:path');

const root = require(path.join(__dirname, '..', 'dist', 'cjs', 'index.js'));
const naming = root.naming || root;
assert.ok(typeof naming === 'object', 'naming utilities should be available');

// Test that core utilities are available
const { ResourceNaming, generateStageName } = root;
assert.ok(typeof ResourceNaming === 'function', 'ResourceNaming class should be available');
assert.ok(typeof generateStageName === 'function', 'generateStageName function should be available');

// Test that constants are available
const { ENV_VALUES } = root;
assert.ok(Array.isArray(ENV_VALUES), 'ENV_VALUES should be an array');

console.log('✅ AWS Utils config smoke test passed');
