const ut = require('./utilities.js');
const fs = require('node:fs');

var day = new Date().getDate();
const filePath = `day${day.toString().padStart(2, '0')}.in`;

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

if (fs.existsSync(filePath)) {
    console.log(`${filePath} already exists.`);
} else {
    writeInputToFile(filePath);
}
