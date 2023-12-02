const ut = require('./utilities.js');
const fs = require('node:fs');
const process = require('node:process');

var year = 2023;
var day = 1;

process.argv.forEach((val, index) => {
    if (index < 2) return;
    if (index == 2) year = parseInt(val);
    if (index == 3) day = parseInt(val);
});

console.log(`year: ${year} day:${day}`);

const paddedDay = day.toString().padStart(2, '0');
const inputFilePath =  year == 2023 ? `${paddedDay}.in` : `${year}/day${paddedDay}.in`;
const dayFilePath = day == 2023 ? `${paddedDay}.js` : `${year}/day${paddedDay}.js`;

async function writeInputToFile(filePath) {
    const input = await ut.fetchInput(day, year);
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