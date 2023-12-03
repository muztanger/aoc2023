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

    distance(other) {
        return Math.abs(this.x - other.x) + Math.abs(this.y, other.y);
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
            for (const dy of [-1, 0, 1]) {
                for (const dx of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0) {
                        continue;
                    }
                    // console.log(`checking ${this.point} + ${dx}, ${dy}`);
                    if (x + dx === other.point.x && this.point.y + dy === other.point.y) {
                        return true;
                    }
                }
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
    {
        var re = /(\d+)/gi;
        var m;
        do {
            m = re.exec(line);
            if (m) {
                numbers.push(new SchemaItem(new Point(m.index, i), m[0]));
            }
        } while (m);
    }
    {
        var re = /([^.0-9])/gi;
        var m;
        do {
            m = re.exec(line);
            if (m) {
                symbols.push(new SchemaItem(new Point(m.index, i), m[0]));
            }
        } while (m);
    }
    i++;
}

sum = 0;
for (const n of numbers) {
    for (const s of symbols) {
        // console.log(`${n} adjacent to ${s}`);
        if (n.adjacent(s)) {
            sum += parseInt(n.item);
            // return;
        }
    }
}
console.log(sum);

totRatio = 0;
for (const s of symbols.filter(s => s.item === '*')) {
    const nums = numbers.filter(n => n.adjacent(s));
    if (nums.length != 2) continue;
    const ratio = parseInt(nums[0].item) * parseInt(nums[1].item);
    totRatio += ratio;
}
console.log(totRatio);