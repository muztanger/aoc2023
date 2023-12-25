const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
let example = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

let useExample = false;
if (useExample) {
    input = example;
}


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

function part1() {
    let hands = [];
    for (let line of input.split('\n')) {
        [handStr, bid] = line.match(/\S+/g);
        hands.push(new Hand(handStr, bid));
    }
    hands.sort((a, b) => a.compare(b));
    
    let result = hands.map((hand, i) => {
        // console.log(hand.hand, ':', (i + 1), '*', hand.bid);
        return (i + 1) * hand.bid;
    }).reduce((a, b) => a + b, 0);
    return result;
}

test('part 1', () => {
    let p1 = part1();
    if (useExample) {
        assert.equal(p1, 6440);
        return;
    } else {
        assert.notEqual(p1, 248604900); // too high
        assert.notEqual(p1, 248047930); // too low
        assert.equal(p1, 248396258);
    }
});

class Hand2 {
    static strength = "J23456789TQKA";

    constructor(hand, bid) {
        this.hand = hand;
        this.bid = bid;
    }

    type() {
        var count = this.hand.split('').reduce((acc, card) => {
            acc[card] = (acc[card] || 0) + 1;
            return acc;
        }, {});
        
        const jokers = count['J'] || 0;
        delete count['J'];

        // five of a kind given jokers
        for (let j = 0; j <= jokers; j++) {
            if (Object.values(count).includes(5 - j)) {
                return 5;
            }
        }

        // four of a kind
        for (let j = 0; j <= jokers; j++) {
            if (Object.values(count).includes(4 - j)) {
                return 4;
            }
        }

        // full house
        if (jokers >= 3) {
            return 3; // JJJAB -> AAABB
        } else if (jokers >= 2 && Object.values(count).filter(x => x === 2).length >= 1) {
            return 3; // JJAAB -> AAABB 
        } else if (jokers >= 1 && Object.values(count).filter(x => x === 2).length >= 2) {
            return 3; // JAABB -> AAABB
        } else if (Object.values(count).includes(3) && Object.values(count).includes(2)) {
            return 3; // AAABB
        }
        // three of a kind
        for (let j = 0; j <= jokers; j++) {
            if (Object.values(count).includes(3 - j)) {
                return 2;
            }
        }

        // two pair
        if (jokers >= 2) {
            return 1; 
        } else if (jokers >= 1 && Object.values(count).filter(x => x === 2).length >= 1) {
            return 1;
        } else if (Object.values(count).filter(x => x === 2).length >= 2) {
            return 1;
        }

        // one pair
        if (Object.values(count).includes(2) || jokers >= 1) {
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
            if (Hand2.strength.indexOf(thisCards[i]) > Hand2.strength.indexOf(otherCards[i])) {
                return 1;
            }

            if (Hand2.strength.indexOf(thisCards[i]) < Hand2.strength.indexOf(otherCards[i])) {
                return -1;
            }
        }

        return 0;
    }
}

test('hand2 type', () => {
    assert.equal(new Hand2('32T3K', 1).type(), 0);
    assert.equal(new Hand2('KK677', 1).type(), 1);
    assert.equal(new Hand2('T55J5', 1).type(), 4);
    assert.equal(new Hand2('KTJJT', 1).type(), 4);
    assert.equal(new Hand2('QQQJA', 1).type(), 4);
});

test('hand2 compare', () => {
    assert.equal(new Hand2('JKKK2', 1).compare(new Hand2('QQQQ2', 1)), -1);
    assert.equal(new Hand2('T55J5', 1).compare(new Hand2('QQQJA', 1)), -1);
    assert.equal(new Hand2('QQQJA', 1).compare(new Hand2('KTJJT', 1)), -1);
});

test('hand2 sort', () => {
    let hands = [];
    for (let line of example.split('\n')) {
        [handStr, bid] = line.match(/\S+/g);
        hands.push(new Hand2(handStr, bid));
    }
    hands.sort((a, b) => a.compare(b));
    assert.equal(hands[0].hand, '32T3K');
    assert.equal(hands[1].hand, 'KK677');
    assert.equal(hands[2].hand, 'T55J5');
    assert.equal(hands[3].hand, 'QQQJA');
    assert.equal(hands[4].hand, 'KTJJT');
});


function part2() {
    let hands = [];
    for (let line of input.split('\n')) {
        [handStr, bid] = line.match(/\S+/g);
        hands.push(new Hand2(handStr, bid));
    }
    hands.sort((a, b) => a.compare(b));
    
    for (let t = -1; t <= 5; t++) {
        let moop = hands.filter(x => x.hand.includes('J') && x.type() === t).map(x => {x.t = x.type(); return x;});
        let x = 10;
    }

    let result = hands.map((hand, i) => {
        // console.log(hand.hand, ':', (i + 1), '*', hand.bid);
        return (i + 1) * hand.bid;
    }).reduce((a, b) => a + b, 0);
    return result;
}

test('part 2', () => {
    let p2 = part2();
    if (useExample) {
        assert.equal(p2, 5905);
        return;
    } else {
        assert.notEqual(p2, 246521649); // too high
        assert.notEqual(p2, 246470519); // too high 
        assert.equal(p2, 0); // assert fail
    }
});
console.log(part2());