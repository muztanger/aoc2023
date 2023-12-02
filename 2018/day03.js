const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Claim {
    constructor(id, pos, size) {
        this.id = id;
        this.pos = pos;
        this.size = size;
    }
}
var claims = [];
for (const line of input.split('\n')) {
    var cols = line.split(' ');
    var id = cols[0].substring(1);
    var x = cols[2].split(',')[0];
    var y = cols[2].split(',')[1].replace(':', '');
    var w = cols[3].split('x')[0];
    var h = cols[3].split('x')[1];
    var claim = new Claim(id, new Point(parseInt(x), parseInt(y)), new Point(parseInt(w), parseInt(h)));
    claims.push(claim);
}

var part1 = 0;
var overlapp = new Set(); 
for (var i = 0; i < claims.length; i++) {
    var c1 = claims[i];
    for (var j = i + 1; j < claims.length; j++) {
        var c2 = claims[j];
        // find overlapping positions
        var x1 = Math.max(c1.pos.x, c2.pos.x);
        var y1 = Math.max(c1.pos.y, c2.pos.y);
        var x2 = Math.min(c1.pos.x + c1.size.x, c2.pos.x + c2.size.x);
        var y2 = Math.min(c1.pos.y + c1.size.y, c2.pos.y + c2.size.y);
        if (x1 < x2 && y1 < y2) {
            for (var x = x1; x < x2; x++) {
                for (var y = y1; y < y2; y++) {
                    overlapp.add(`${x},${y}`);
                }
            }
        }
    }
}

for (var i = 0; i < claims.length; i++) {
    var c = claims[i];
    var overlapped = false;
    for (var x = c.pos.x; x < c.pos.x + c.size.x; x++) {
        for (var y = c.pos.y; y < c.pos.y + c.size.y; y++) {
            if (overlapp.has(`${x},${y}`)) {
                overlapped = true;
                break;
            }
        }
        if (overlapped) {
            break;
        }
    }
    if (!overlapped) {
        console.log(c.id);
        break;
    }
}

console.log(overlapp.size);