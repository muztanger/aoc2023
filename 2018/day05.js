const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

var input = fs.readFileSync("2018/"+path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
//input = `dabAcCaCBAcCcaDA`;

function react(inp) {
    var stack = inp.split('');
    var result = [];
    while (stack.length > 0) {
        var c = stack.pop();
        var d = result.pop();
        if (d == undefined) {
            result.push(c);
        } else if (c != d && c.toLowerCase() == d.toLowerCase()) {
            // do nothing
        } else {
            result.push(d);
            result.push(c);
        }
    }
    return result.reverse().join('');    
}

test('part1', function() {
    assert.strictEqual(react(input).length, 9348);
});

var min = input.length;
for (var r of "abcdefghijklmnopqrstuvwxyz") {
    min = Math.min(min, react(input.replace(new RegExp(r, 'gi'), '')).length);
}

test('part2', function() {
    assert.strictEqual(min, 4996);
});