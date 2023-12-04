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

var count = new Map();
var scores = new Map();
var cards = [];
var part1 = 0;
for (const line of input.split('\n')) {
    // console.log(line);
    const cardId = parseInt(line.split(':')[0].split(/[\s]+/)[1].trim());
    // console.log(cardId);
    const data = line.split(':')[1];
    const win = new Set(data.split('|')[0].trim().split(/[\s]+/).map(Number));
    const my = new Set(data.split('|')[1].trim().split(/[\s]+/).map(Number));
    count.set(cardId, 1);
    var m = [...my].filter((x) => win.has(x));
    var score = m.reduce((a, b) => a * 2, 1);
    score = Math.floor(score / 2);
    scores.set(cardId, [score, m.length]);
    cards.push(cardId);
    part1 += score;
}
console.log(part1);

var part2 = 0;
while (Array.from(count.values()).some((x) => x > 0)) {
    for (const card of cards) {
        if (count.get(card) == 0) continue;
        // console.log(card, count.get(card), scores.get(card));
        var [score, len] = scores.get(card);
        // part2 += score;

        count.set(card, count.get(card) - 1);
        part2++;

        // if (len == 0) continue;
        // console.log(len);
        for (var i = card + 1; i <= card + len; i++) {
            if (i > cards.length) {
                console.error('i', i, 'len', len, 'card', card);
                break;
            }
            count.set(i, count.get(i) + 1);
        }
        // console.log(card, count.get(card), scores.get(card));
    }
    // console.log(count);
}
console.log(part2);