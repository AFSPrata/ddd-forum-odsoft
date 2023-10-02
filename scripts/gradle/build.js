// Import required modules
const { execSync } = require('child_process');
const path = require('path');

// Define the build process
function build() {
  console.log('Starting build process...');

  // Set the working directory to the root of the project
  const projectRoot = path.resolve(__dirname, '../../');
  process.chdir(projectRoot);

  try {
    // Install dependencies
    console.log('Installing dependencies...');
    // The flag --dry-run is used to simulate the installation of the dependencies
    // The object { stdio: 'inherit' } is used to display the output of the command in the console
    execSync('npm install --dry-run', { stdio: 'inherit' });

    // Build the application
    console.log('Building the application...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('Build process completed successfully.');
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

// Call the build function to start the build process
build();