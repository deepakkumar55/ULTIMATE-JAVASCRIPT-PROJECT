const fs = require('fs');
const path = require('path');

// Use a path in your home directory to avoid permission issues
const basePath = path.join(__dirname, 'Personal\ Projects');

const projects = [
    "Personal Budget Tracker","Home Inventory","Workout Routine Planner","Grocery List","Pet Care App","Family Calendar","Chore Chart","Travel Journal","Wedding Planner","Gift Tracker"
];

projects.forEach((project, index) => {
    const folderName = `${index + 1}-${project.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    const folderPath = path.join(basePath, folderName);
    fs.mkdirSync(folderPath, { recursive: true });

    const readmeContent = `# ${project}\n\n## Description\n\nA brief description of the ${project.toLowerCase()} project.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Technologies Used\n\n- JavaScript\n- HTML\n- CSS\n\n## Setup\n\nInstructions to set up and run the project.\n`;

    fs.writeFileSync(path.join(folderPath, 'README.md'), readmeContent);
});

console.log('Folders and README.md files created for all projects.');
