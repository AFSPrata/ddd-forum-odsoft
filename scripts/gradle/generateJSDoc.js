// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the JSDoc generation process
function generateJSDoc() {
  console.log('Starting JSDoc generation process...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Install dependencies
    console.log('Installing dependencies...');
    // The flag --dry-run is used to simulate the installation of the dependencies
    // The object { stdio: 'inherit' } is used to display the output of the command in the console
    execSync('npm install --dry-run', { stdio: 'inherit' });
    
    // Generate JSDoc
    console.log('Generating JSDoc...');
    execSync('npm run jsdoc', { stdio: 'inherit' });
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

// Call the build function to start the generate JSDoc process
generateJSDoc();