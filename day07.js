const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

var input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
var example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;
// input = example;


class Hand {

    constructor(hand, bid) {
        this.strength = "23456789TJQKA";
        this.hand = hand;
        this.bid = bid;
    }

    type() {
        var count = this.hand.split('').reduce((acc, card) => {
            acc[card] = (acc[card] || 0) + 1;
            return acc;
        }, {});

        // five of a kind
        if (Object.values(count).includes(5)) {
            return 5;
        }

        // four of a kind
        if (Object.values(count).includes(4)) {
            return 4;
        }

        // full house
        if (Object.values(count).includes(3) && Object.values(count).includes(2)) {
            return 3;
        }

        // three of a kind
        if (Object.values(count).includes(3)) {
            return 2;
        }

        // two pair
        if (Object.values(count).filter(x => x === 2).length === 2) {
            return 1;
        }

        // one pair
        if (Object.values(count).includes(2)) {
            return 0;
        }

        // high card
        return -1;
    }

    compare(other) {
        var type = this.type();
        var otherType = other.type();

        if (type > otherType) {
            return 1;
        }

        if (type < otherType) {
            return -1;
        }

        var thisCards = this.hand;
        var otherCards = other.hand;
        for (var i = 0; i < thisCards.length; i++) {
            if (this.strength.indexOf(thisCards[i]) > this.strength.indexOf(otherCards[i])) {
                return 1;
            }

            if (this.strength.indexOf(thisCards[i]) < this.strength.indexOf(otherCards[i])) {
                return -1;
            }
        }

        return 0;
    }
}

var hands = [];
for (var line of input.split('\n')) {
    [handStr, bid] = line.match(/\S+/g);
    hands.push(new Hand(handStr, bid));
}
hands.sort((a, b) => a.compare(b));

var part1 = hands.map((hand, i) => {
    // console.log(hand.hand, ':', (i + 1), '*', hand.bid);
    return (i + 1) * hand.bid;
}).reduce((a, b) => a + b, 0);

// 248604900 is too high
// 248396258
// 248047930 is too low
console.log(part1);