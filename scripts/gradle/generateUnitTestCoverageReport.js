// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the generation process
function generateUnitTestCoverageReport() {
  console.log('Runing Unit Tests...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Run Tests with coverage
    execSync('npm run testWithCoverage', { stdio: 'inherit' });
  } catch (error) {
    console.error('Unit Tests with coverage failed:', error);
    process.exit(1);
  }
}

// Call the function to generate Unit Tests Coverage Report
generateUnitTestCoverageReport();