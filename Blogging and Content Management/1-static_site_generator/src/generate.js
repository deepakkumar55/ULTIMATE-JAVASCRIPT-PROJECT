const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Paths
const contentDir = path.join(__dirname, '../content');
const distDir = path.join(__dirname, '../dist');
const templateFile = path.join(__dirname, '../templates/index.html');

// Read template
const template = fs.readFileSync(templateFile, 'utf8');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Generate static site
fs.readdir(contentDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const htmlContent = marked(fileContent);
        const output = template.replace('{{{content}}}', htmlContent);

        const outputFileName = file.replace('.md', '.html');
        const outputPath = path.join(distDir, outputFileName);

        fs.writeFileSync(outputPath, output);
        console.log(`Generated ${outputFileName}`);
    });
});
