// Import required modules
const { execSync } = require('child_process');
const path = require('path');
var plantuml = require('node-plantuml');
var fs = require('fs');

// Define the JSDoc generation process
function generatePUSDListPopularPosts() {
    // Set the working directory to the root of the project
    const projectRoot = path.resolve(__dirname, '../../');
    process.chdir(projectRoot);
    
    try {
      // Install dependencies
      console.log('Installing dependencies...');
      // The flag --dry-run is used to simulate the installation of the dependencies
      // The object { stdio: 'inherit' } is used to display the output of the command in the console
      execSync('npm install --dry-run', { stdio: 'inherit' });      

      console.log('Starting generation process...');

      var gen = plantuml.generate("scripts/plantuml/ListPopularPosts.puml", {format: 'png'});
      gen.out.pipe(fs.createWriteStream("images/list-popular-posts.png"));
    } catch (error) {
      console.error('Generation of PlantUML Sequence Diagram of "ListPopularPosts" request failed:', error);
      process.exit(1);
    }
}

// Call the function to start the generate JSDoc process
generatePUSDListPopularPosts();