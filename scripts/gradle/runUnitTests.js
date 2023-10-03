// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the JSDoc generation process
function runUnitTests() {
  console.log('Runing Unit Tests...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Run Unit Tests 
    execSync('npm run test', { stdio: 'inherit' });
  } catch (error) {
    console.error('Unit Tests failed:', error);
    process.exit(1);
  }
}

// Call the function to run Unit Tests
runUnitTests();