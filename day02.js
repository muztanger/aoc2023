const test = require('node:test');
const assert = require('node:assert/strict');
const ut = require('./utilities.js');
const fs = require('node:fs');


const input = fs.readFileSync('day02.in', { encoding: 'utf8' });

class Bag {
    constructor(blue, red, green) {
        this.blue = blue;
        this.red = red;
        this.green = green;
    }
}

class Game {
    constructor(bag) {
        this.id = 0;
        this.bag = bag;
    }

    check(line) {
        this.id = parseInt(line.split(':')[0].split(' ')[1]);
        line = line.split(':')[1].trim();
        var sets = line.split(';').map(x => x.trim());
        for (var set of sets) {
            var split = set.split(',').map(x => x.trim());
            var b = new Bag(this.bag.blue, this.bag.red, this.bag.green);
            for (var color of split.map(x => x.split(' '))) {
                if (color[1].startsWith('blue')) {
                    b.blue -= parseInt(color[0]);
                } else if (color[1].startsWith('red')) {
                    b.red -= parseInt(color[0]);
                } else if (color[1].startsWith('green')) {
                    b.green -= parseInt(color[0]);
                }
            }
            if (b.blue < 0 || b.red < 0 || b.green < 0) {
                return 0;
            }
        }
        return this.id;
    }

    power(line) {
        this.id = parseInt(line.split(':')[0].split(' ')[1]);
        line = line.split(':')[1].trim();
        var sets = line.split(';').map(x => x.trim());
        var b = new Bag(0, 0 ,0);
        for (var set of sets) {
            var split = set.split(',').map(x => x.trim());
            for (var color of split.map(x => x.split(' '))) {
                if (color[1].startsWith('blue')) {
                    b.blue = Math.max(b.blue, parseInt(color[0]));
                } else if (color[1].startsWith('red')) {
                    b.red = Math.max(b.red, parseInt(color[0]));
                } else if (color[1].startsWith('green')) {
                    b.green = Math.max(b.green, parseInt(color[0])) ;
                }
            }
        }
        console.log(line + ":    " + b.blue + " " + b.red + " " + b.green)
        return b.blue * b.green * b.red;
    }
}

sum = 0;
powerSum = 0;
var id = 0;
for (var line of input.split('\n')) {
    var game = new Game(new Bag(14, 12, 13));
    sum += game.check(line);
    powerSum += game.power(line);
}
console.log(sum);
console.log(powerSum);