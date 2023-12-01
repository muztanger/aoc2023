const test = require('node:test');
const assert = require('node:assert/strict');
const ut = require('../utilities.js');

const input = ut.fetchInput(1);

var inputExample = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
8threefourkkkhvc68four`;
var dict = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

async function calc(input, part = 1) {
    input = await input;
    var sum = 0;
    for (var line of input.split('\n')) {
        var digits = new Map();
        if (part == 2) {
            for (var digit in dict) {
                var index = -1;
                while ((index = line.indexOf(dict[digit], index + 1)) != -1) {
                    digits.set(index, parseInt(digit) + 1);
                }
            }
        }
        for (var i in line.split('')) {
            if (line[i] >= '0' && line[i] <= '9') {
                digits.set(parseInt(i), parseInt(line[i]));
            }
        }
        if (digits.size > 0) {
            var sort = [...digits.keys()].map(x => parseInt(x));
            sort.sort(function (a, b) {return a - b;});
            var lineValue = parseInt("" + digits.get(sort[0]) + digits.get(sort[sort.length - 1]));
            sum += lineValue;
        }
    }
    return sum;
}

test('Part 1', async (t) => {
    await t.test('part1 example', async () => {
        const result = await calc(`1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`, 1);
        assert.strictEqual(result, 142);
    });
    await t.test('part1 input', async () => {
        const result = await calc(input, 1);
        assert.strictEqual(result, 54927);
    });
});


test('Part 2', async (t) => {
    await t.test('part2 example', async () => {
        const result = await calc(inputExample, 2);
        assert.strictEqual(result, 365);
    });
    await t.test('part2 input', async () => {
        const result = await calc(input, 2);
        assert.strictEqual(result, 54581);
    });
});
