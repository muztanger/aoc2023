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

const bigTime = parseInt(lines[0].split(':')[1].replace(/\s+/g, ''));
const bigDistance = parseInt(lines[1].split(':')[1].replace(/\s+/g, ''));
// const bigTime = 71530;
// const bigDistance = 940200;
console.log(bigTime, bigDistance);

var a = 1;
var b = bigTime;
var i = 0;
while (a != b && i++ < 10000) {
    if (a * (bigTime - a) < bigDistance) {
        var c = Math.floor((a + b) / 2);
        if (c * (bigTime - c) < bigDistance) {
            a = c + 1;
        } else {
            b = c;
        }
    }
}

var lower = a;

b = bigTime;
i = 0;
while (a != b && i++ < 10000) {
    if (b * (bigTime - b) < bigDistance) {
        var c = Math.floor((a + b) / 2);
        if (c * (bigTime - c) > bigDistance) {
            a = c + 1;
        } else {
            b = c;
        }
    }
}

var upper = b - 1;

console.log(lower, lower * (bigTime - lower) - bigDistance);
console.log(upper, upper * (bigTime - upper) - bigDistance);

var part2 = upper - lower + 1;
console.log(part2);