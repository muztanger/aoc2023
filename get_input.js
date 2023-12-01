const ut = require('./utilities.js');
const fs = require('node:fs');

var day = new Date().getDate();
const inputFilePath = `day${day.toString().padStart(2, '0')}.in`;
const dayFilePath = `day${day.toString().padStart(2, '0')}.js`;

async function writeInputToFile(filePath) {
    const input = await ut.fetchInput(day);
    fs.writeFile(filePath, input, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } else {
            console.log(`Written to ${filePath} successfully.`);
        }
    });
}

if (fs.existsSync(inputFilePath)) {
    console.log(`${inputFilePath} already exists.`);
} else {
    writeInputToFile(inputFilePath);
}

if (!fs.existsSync(dayFilePath)) {
    fs.copyFile('template.js', dayFilePath, (err) => {
        if (err) {
            console.error("Error copying template:", err);
        } else {
            console.log(`Copied template to ${dayFilePath} successfully.`);
        }
    });
}