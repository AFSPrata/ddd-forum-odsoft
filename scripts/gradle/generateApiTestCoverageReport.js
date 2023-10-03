// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the generation process
function generateApiTestCoverageReport() {
  console.log('Runing Api Tests...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Run Tests with coverage
    execSync('npm run test:api', { stdio: 'inherit' });
  } catch (error) {
    console.error('Api Tests with coverage failed:', error);
    process.exit(1);
  }
}

// Call the function to generate Api Tests Coverage Report
generateApiTestCoverageReport();