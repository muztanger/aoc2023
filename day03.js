const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Ajacent points are those that are one step away in any direction, including diagonal step.
    adjacent(other) {
        return Math.max(Math.abs(this.x - other.x), Math.abs(this.y - other.y)) === 1;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

class SchemaItem {
    constructor(point, item) {
        this.point = point;
        this.item = item;
    }

    adjacent(other) {
        for (var x = this.point.x; x < this.point.x + this.item.length; x++) {
            const p = new Point(x, this.point.y);
            if (p.adjacent(other.point)) {
                return true;
            }
        }
        return false;
    }

    toString() {
        return `${this.item} @ ${this.point}`;
    }
}

numbers = [];
symbols = [];
var i = 0;
for (const line of input.split('\n')) {
    var m;
    var re = /(\d+)/gi;
    while (m = re.exec(line)) {
        numbers.push(new SchemaItem(new Point(m.index, i), m[0]));
    }
    re = /([^.0-9])/gi;
    while (m = re.exec(line)) {
        symbols.push(new SchemaItem(new Point(m.index, i), m[0]));
    }
    i++;
}

var part1 = 0;
for (const n of numbers) {
    for (const s of symbols) {
        if (n.adjacent(s)) {
            part1 += parseInt(n.item);
        }
    }
}

var part2 = 0;
for (const s of symbols.filter(s => s.item === '*')) {
    const nums = numbers.filter(n => n.adjacent(s));
    if (nums.length != 2) continue;
    const ratio = parseInt(nums[0].item) * parseInt(nums[1].item);
    part2 += ratio;
}

test('part1', function () {
    assert.strictEqual(part1, 536202);
});

test('part2', function () {
    assert.strictEqual(part2, 78272573);
});