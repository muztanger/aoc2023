const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

var sum = 0;
var part1 = null;
var part2 = null;
var set = new Set();
set.add(part1);
while(part2 == null) {
    for (const line of input.split('\n')) {
        sum += parseInt(line);
        if (set.has(sum)) {
            part2 = sum;
            break;
        }
        set.add(sum);
    }
    if (part1 == null) {
        part1 = sum;
    }
}
console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
