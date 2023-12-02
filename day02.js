const test = require('node:test');
const assert = require('node:assert/strict');
const ut = require('./utilities.js');
const fs = require('node:fs');


const input = fs.readFileSync('day02.in', { encoding: 'utf8' });

class Bag {
    constructor(red, green, blue) {
        this.blue = blue;
        this.red = red;
        this.green = green;
    }
}

class GameSet {
    constructor() {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
    }
}

class Game {
    constructor(bag) {
        this.id = 0;
        this.bag = bag;
        this.sets = [];
    }

    static parse(line, bag) {
        var result = new Game(bag);
        result.id = parseInt(line.split(':')[0].split(' ')[1]);
        line = line.split(':')[1].trim();
        var sets = line.split(';').map(x => x.trim());
        for (var set of sets) {
            var split = set.split(',').map(x => x.trim());
            var gameSet = new GameSet();
            for (var color of split.map(x => x.split(' '))) {
                if (color[1].startsWith('blue')) {
                    gameSet.blue = parseInt(color[0]);
                } else if (color[1].startsWith('red')) {
                    gameSet.red = parseInt(color[0]);
                } else if (color[1].startsWith('green')) {
                    gameSet.green = parseInt(color[0]);
                }
            }
            result.sets.push(gameSet);
        }
        return result;
    }

    check() {
        for (var set of this.sets) {
            if (set.red > this.bag.red ||  set.green > this.bag.green || set.blue > this.bag.blue) {
                return 0;
            }
        }
        return this.id;
    }

    power() {
        var b = new GameSet();
        for (var set of this.sets) {
            b.red = Math.max(b.red, set.red);
            b.green = Math.max(b.green, set.green);
            b.blue = Math.max(b.blue, set.blue);
        }
        return b.blue * b.green * b.red;
    }
}

var part1 = 0;
var part2 = 0;
for (var line of input.split('\n')) {
    var game = Game.parse(line, new Bag(12, 13, 14));
    part1 += game.check();
    part2 += game.power();
}

test('Day 2 part 1', () => {
    assert.strictEqual(part1, 1931);
});

test('Day 2 part 2', () => {
    assert.strictEqual(part2, 83105);
});