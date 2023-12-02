const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
var two = 0;
var three = 0;
for (const line of input.split('\n')) {
    counts = {};
    for (const char of line.split('')) {
        if (counts[char] == undefined) {
            counts[char] = 0;
        }
        counts[char]++;
    }
    for (const char in counts) {
        if (counts[char] == 2) {
            two++;
            break;
        }
    }
    for (const char in counts) {
        if (counts[char] == 3) {
            three++;
            break;
        }
    }
}
console.log(two * three);
var part2 = null;
for (const line of input.split('\n')) {
    for (const line2 of input.split('\n')) {
        if (line == line2) {
            continue;
        }
        var diff = 0;
        for (var i = 0; i < line.length; i++) {
            if (line[i] != line2[i]) {
                diff++;
            }
        }
        if (diff == 1) {
            for (var i = 0; i < line.length; i++) {
                if (line[i] == line2[i]) {
                    if (part2 == null) {
                        part2 = '';
                    }
                    part2 += line[i];
                }
            }
            break;
        }
    }
    if (part2 != null) {
        break;
    }
}
console.log(part2);
// cvgywxqubnuaefmsljdrpfzyi