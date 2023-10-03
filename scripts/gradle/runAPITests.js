// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the generation process
function runAPITests() {
  console.log('Runing API Tests...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Run Tests with coverage
    execSync('npm run test:apiWithoutCoverage', { stdio: 'inherit' });
  } catch (error) {
    console.error('API Tests failed:', error);
    process.exit(1);
  }
}

// Call the function to run API Tests
runAPITests();