const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const lines = input.split('\n');
const times = lines[0].split(':')[1].trim().split(/\s+/g).map(x => parseInt(x));
const distances = lines[1].split(':')[1].trim().split(/\s+/g).map(x => parseInt(x));
const N = times.length;

var part1 = 1;
for (var race = 0; race < N ; race++) {
    var count = 0;
    for (var pressTime = 1; pressTime < times[race]; pressTime++) {
        distance = pressTime * (times[race] - pressTime);
        if (distance > distances[race]) {
            count++;
        }
    }
    console.log(count);
    part1 *= count;
}
console.log(part1);