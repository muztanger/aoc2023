const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const useExample = true;
if (useExample) {
    input = `...........
    .S-------7.
    .|F-----7|.
    .||.....||.
    .||.....||.
    .|L-7.F-J|.
    .|..|.|..|.
    .L--J.L--J.
    ...........`;
}


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
    if (useExample) {
        assert.equal(part1, 23);
    } else {
        assert.equal(part1, 7097);
    }
});

console.log("Part 2");

// expand tiles to 3x3 sprites
const sprites = {
    "|": [" # ",
          " # ", 
          " # "],
    "-": ["   ",
          "###",
          "   "],
    "L": [" # ",
          " ##",
          "   "],
    "J": [" # ",
          "## ",
          "   "],
    "7": ["   ",
          "## ",
          " # "],
    "F": ["   ",
          " ##",
          " # "],
    "S": ["   ",
          " S ",
          "   "],
    ".": [".  ",
          "   ",
          "   "]
}

const expandedTiles = [];
for (const tilePos of loopTiles) {
    const tile = tiles[tilePos];
    const sprite = sprites[tile.dir];
    for (let y = 0; y < sprite.length; y++) {
        for (let x = 0; x < sprite[y].length; x++) {
            const pos = new Pos(tile.pos.x * sprite[y].length + x, tile.pos.y * sprite.length + y);
            expandedTiles[pos.asKey()] = new Tile(pos, sprite[y][x]);
        }
    }
}

console.log("Expanded tiles", Object.keys(expandedTiles).length);

// find loop area of expanded tiles
var min = new Pos(lines[0].length * 3, lines.length * 3);
var max = new Pos(0, 0);
for (const posAsKey of Object.keys(expandedTiles)) {
    const tile = expandedTiles[posAsKey];
    min.x = Math.min(min.x, tile.pos.x);
    min.y = Math.min(min.y, tile.pos.y);
    max.x = Math.max(max.x, tile.pos.x);
    max.y = Math.max(max.y, tile.pos.y);
}

console.log(min, max);

// print expanded tiles
for (let y = min.y; y <= max.y; y++) {
    let line = "";
    for (let x = min.x; x <= Math.min(max.x, 200); x++) {
        const pos = new Pos(x, y);
        if (expandedTiles[pos.asKey()]) {
            line += expandedTiles[pos.asKey()].dir;
        } else {
            line += " ";
        }
    }
    console.log(line);
}

// find inner tiles by raycasting every third y position
const innerTiles = new Set();
for (let y = min.y; y <= max.y; y += 3) {
    let isInside = false;
    for (let x = min.x - 1; x <= max.x; x++) {
        const pos = new Pos(x, y);
        if (expandedTiles[pos.asKey()] && expandedTiles[pos.asKey()].dir == "#") {
            isInside = !isInside;
        } else if (isInside) {
            innerTiles.add(pos.asKey());
        }
    }
}


console.log("after horizontal", innerTiles.size);

// print inner tiles and expanded tiles
let count = 0;
for (let y = min.y; y <= max.y; y++) {
    let line = "";
    for (let x = min.x; x <= max.x; x++) {
        const pos = new Pos(x, y);
        if (expandedTiles[pos.asKey()]) {
            line += expandedTiles[pos.asKey()].dir;
        } else if (innerTiles.has(pos.asKey())) {
            line += "I";
            count++;
        } else {
            line += " ";
        }
    }
    console.log(line);
}
console.log("inner tiles", count / 3);

test('part2', () => {
    if (useExample) {
        assert.equal(count / 3, 4);
    } else {
        assert.equal(count / 3, 355);
    }
});