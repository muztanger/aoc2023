const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }

    asKey() {
        return `${this.x},${this.y}`;
    }
}

class Tile {
    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    connections() {
        switch (this.dir) {
            case "|":
                return [new Pos(0, 1), new Pos(0, -1)].map(x => this.pos.add(x));
            case "-":
                return [new Pos(1, 0), new Pos(-1, 0)].map(x => this.pos.add(x));
            case "L":
                return [new Pos(1, 0), new Pos(0, -1)].map(x => this.pos.add(x));
            case "J":
                return [new Pos(-1, 0), new Pos(0, -1)].map(x => this.pos.add(x));
            case "7":
                return [new Pos(-1, 0), new Pos(0, 1)].map(x => this.pos.add(x));
            case "F":
                return [new Pos(1, 0), new Pos(0, 1)].map(x => this.pos.add(x));
            default:
                return [];
        }
    }

    static isPipe(c) {
        return "|-LJ7F".includes(c);
    }

    static isStart(c) {
        return c == "S";
    }

    static isGround(c) {
        return c == ".";
    }
}

var start = null;
const tiles = [];
const lines = input.split('\n').map(x => x.trim());
for (var y = 0; y < lines.length; y++) {
    for (var x = 0; x < lines[y].length; x++) {
        const pos = new Pos(x, y);
        const c = lines[y][x];
        if (Tile.isGround(c)) {
            continue;
        }
        if (Tile.isPipe(c)) {
            tiles[pos.asKey()] = new Tile(pos, c);
            continue;
        }
        if (Tile.isStart(c)) {
            start = new Tile(pos, c);
            tiles[pos.asKey()] = start;
            continue;
        }
    }
}
// for (var y = 0; y < 10; y++) {
//     var line = "";
//     for (var x = 0; x < 10; x++) {
//         const pos = new Pos(x, y);
//         if (tiles[pos.asKey()] === undefined) {
//             line += ".";
//         }
//         else {
//             line += tiles[pos.asKey()].dir;
//         }
//     }
//     console.log(line);
// }
