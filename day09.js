const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

var input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

const example2 = `9 15 36 90 202 414 817 1611 3207 6404 12720 25069 49235 97138 193942 392967 805641 1659073 3402208 6894216 13727420
9 5 1 -3 -7 -11 -15 -19 -23 -27 -31 -35 -39 -43 -47 -51 -55 -59 -63 -67 -71
-2 -4 -6 -8 -10 -12 -14 -16 -18 -20 -22 -24 -26 -28 -30 -32 -34 -36 -38 -40 -42`;

// input = example;

var part1 = 0;
var part2 = 0;
for (line of input.split('\n')) {
    if (line.length === 0) {
        continue;
    }
    const values = line.split(/\s+/).map(x => parseInt(x));
    // console.log(values);

    var diffs = [values];
    while (diffs.length == 0 || diffs[diffs.length - 1].some(x => x != 0)) {
        var curr = diffs[diffs.length - 1];
        var diffline = [];
        for (var i = 1; i < curr.length; i++) {
            diffline.push(curr[i] - curr[i - 1]);
        }
        diffs.push(diffline);
    }
    console.log(diffs);
    var next = diffs.reduce((acc, xs) => acc + xs[xs.length - 1], 0);
    var ys = [0];
    for (var i = diffs.length - 2; i >= 0; i--) {
        ys.push(diffs[i][0] - ys[ys.length - 1]);
    }
    console.log(ys);
    part2 += ys[ys.length - 1];

    part1 += next;
    console.log(next, part1);
}

console.log(part1); // 2038472161
console.log(part2);