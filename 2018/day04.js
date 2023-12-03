const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
for (const line of input.split('\n')) {
 console.log(line);
}