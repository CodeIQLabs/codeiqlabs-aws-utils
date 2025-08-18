// Test ESM imports for aws-utils
import { ResourceNaming, generateStageName, ENV_VALUES } from '../dist/esm/index.js';

console.log('Testing ESM imports for aws-utils...');

// Test that utilities are available
if (typeof ResourceNaming !== 'function') {
  throw new Error('ResourceNaming should be a function');
}

if (typeof generateStageName !== 'function') {
  throw new Error('generateStageName should be a function');
}

if (!Array.isArray(ENV_VALUES)) {
  throw new Error('ENV_VALUES should be an array');
}

// Test basic functionality
const naming = new ResourceNaming('TestProject', 'nprd');
const stackName = naming.getStackName('TestStack');
if (typeof stackName !== 'string' || !stackName.includes('TestProject')) {
  throw new Error('ResourceNaming should generate valid stack names');
}

console.log('✅ ESM import test for aws-utils passed');
