const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

var input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
var example = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
// input  = example;

var count = [];
var scores = new Map();
var cards = [];
var part1 = 0;
for (const line of input.split('\n')) {
    const split = line.split(':');

    const cardId = parseInt(split[0].split(/[\s]+/)[1].trim());
    count[cardId] = 1;
    cards.push(cardId);
    
    const data = split[1].split('|');
    const win = new Set(data[0].trim().split(/[\s]+/).map(Number));
    const my = new Set(data[1].trim().split(/[\s]+/).map(Number));

    var matchWin = [...my].filter((x) => win.has(x));
    var score = matchWin.reduce((a, b) => a * 2, 1);
    score = Math.floor(score / 2);
    scores.set(cardId, [score, matchWin.length]);
    
    part1 += score;
}

var part2 = 0;
while (count.some((x) => x > 0)) {
    for (const cardId of cards.filter((x) => count[x] > 0)) {
        var [_, len] = scores.get(cardId);
        
        count[cardId]--;
        part2++;

        for (var i = cardId + 1; i <= cardId + len; i++) {
            count[i]++;
        }
    }
}

test('part1', () => {
    assert.strictEqual(part1, 24160);
});

test('part2', () => {
    assert.strictEqual(part2, 5659035);
});