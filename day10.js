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

    directions() {
        switch (this.dir) {
            case "|":
                return [new Pos(0, 1), new Pos(0, -1)];
            case "-":
                return [new Pos(1, 0), new Pos(-1, 0)];
            case "L":
                return [new Pos(1, 0), new Pos(0, -1)];
            case "J":
                return [new Pos(-1, 0), new Pos(0, -1)];
            case "7":
                return [new Pos(-1, 0), new Pos(0, 1)];
            case "F":
                return [new Pos(1, 0), new Pos(0, 1)];
            case "S":
                return [new Pos(1, 0), new Pos(0, 1), new Pos(-1, 0), new Pos(0, -1)];
            default:
                return [];
        }
    }

    connections() {
        return this.directions().map(d => this.pos.add(d));
    }

    isConnected(other) {
        return this.connections().some(p => p.x == other.pos.x && p.y == other.pos.y 
            && other.connections().some(q => q.x == this.pos.x && q.y == this.pos.y));
    }

    hasVerticalEdge() {
        return "|LJ7F".includes(this.dir);
    }

    hasLeftEdge() {
        return "|LF".includes(this.dir);
    }

    hasRightEdge() {
        return "|J7".includes(this.dir);
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
        if (Tile.isPipe(c) || Tile.isGround(c)) {
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

// Find loop length
const loopTiles = new Set();
const stack = [start];
var loop = -1;
while (stack.length > 0) {
    const current = stack.pop();
    if (loopTiles.has(current.pos.asKey())) {
        break;
    }
    loopTiles.add(current.pos.asKey());
    for (const pos of current.connections().filter(p => !loopTiles.has(p.asKey()) && tiles[p.asKey()])) {
        if (current.isConnected(tiles[pos.asKey()])) {
            stack.push(tiles[pos.asKey()]);
        }
    }
    loop++;
}

part1 = loopTiles.size / 2;
console.log(part1);

// test part1
test('part1', () => {
    assert.equal(part1, 7097);
});

// find loop area
var min = new Pos(lines[0].length, lines.length);
var max = new Pos(0, 0);
for (const posAsKey of loopTiles.values()) {
    const tile = tiles[posAsKey];
    // console.log(tile);
    min.x = Math.min(min.x, tile.pos.x);
    min.y = Math.min(min.y, tile.pos.y);
    max.x = Math.max(max.x, tile.pos.x);
    max.y = Math.max(max.y, tile.pos.y);
}

console.log(min, max);

const innerTiles = new Set();
const deletedTiles = new Set();

// trace horizontal
for (var y = min.y; y <= max.y; y++) {
    var isFirst = true;
    var count = 0;
    for (var x = min.x; x <= max.x; x++) {
        const pos = new Pos(x, y);
        if (loopTiles.has(pos.asKey())) {
            const tile = tiles[pos.asKey()];
            if (y == 3) {
                console.log(tile, tile.hasVerticalEdge(), count);
            }
            if (tile.hasVerticalEdge()) {
                count = (count + 1) % 2
            }
            isFirst = false;
            continue;
        }
        if (isFirst) continue;
        if (tiles[pos.asKey()].dir == '.' && count % 2 == 1) {
            innerTiles.add(pos.asKey());
        }
    }
}
console.log("after horizontal", innerTiles.size);

// // trace vertical
// for (var x = min.x; x <= max.x; x++) {
//     var isFirst = true;
//     var count = 0;
//     for (var y = min.y; y <= max.y; y++) {
//         const pos = new Pos(x, y);
//         if (loopTiles.has(pos.asKey())) {
//             count++;
//             isFirst = false;
//             continue;
//         }
//         if (isFirst) continue;
//         if (tiles[pos.asKey()].dir == '.' && count % 2 == 0) {
//             if (!deletedTiles.has(pos.asKey())) {
//                 innerTiles.add(pos.asKey());
//             }
//         }
//     }
// }
// console.log("after vertical", innerTiles.size);

// print loop of all tiles and inner tiles
for (var y = 0; y < lines.length; y++) {
    var line = "";
    for (var x = 0; x < lines[y].length; x++) {
        const pos = new Pos(x, y);
        if (loopTiles.has(pos.asKey())) {
            line += tiles[pos.asKey()].dir;
            continue;
        }
        if (innerTiles.has(pos.asKey())) {
            line += "I";
            continue;
        }
        line += " ";
    }
    console.log(line);
}
console.log(innerTiles.size);