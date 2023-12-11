const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const exp = require('node:constants');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

var grid = input.split('\n').map((line) => line.split(''));

var expanedRows = [];
var expandedRowIndexes = [];
// expand rows
for (let i = 0; i < grid.length; i++) {
    row = [];
    let isEmpty = true;
    for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] != '.') {
            isEmpty = false;
        }
        row[j] = grid[i][j];
    }
    expanedRows.push(row);
    if (isEmpty) {
        expandedRowIndexes.push(i);
        expanedRows.push(Array.from({length: grid[0].length}, (_) => '.'));
    }
}

// expand columns
var expandedGrid = [];
let expandedColIndexes = [];
for (let i = 0; i < expanedRows[0].length; i++) {
    var isEmpty = true;
    for (let j = 0; j < expanedRows.length; j++) {
        if (expandedGrid[j] == undefined) {
            expandedGrid[j] = [];
        }
        if (expanedRows[j][i] != '.') {
            isEmpty = false;
        }
        expandedGrid[j].push(expanedRows[j][i]);
    }
    if (isEmpty) {
        expandedColIndexes.push(i);
        for (let j = 0; j < expandedGrid.length; j++) {
            expandedGrid[j].push('.');
        }
    }
}

// console.log(expandedGrid.length, expandedGrid[0].length);

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    asKey() {
        return `${this.x},${this.y}`;
    }
}

let galaxies = [];
for (let i = 0; i < expandedGrid.length; i++) {
    for (let j = 0; j < expandedGrid[i].length; j++) {
        if (expandedGrid[i][j] == '#') {
            galaxies.push(new Pos(i, j));
        }
    }
}

let part1 = 0;
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        let dx = Math.abs(galaxies[i].x - galaxies[j].x);
        let dy = Math.abs(galaxies[i].y - galaxies[j].y);
        part1 += dx + dy;
    }
}
console.log('Part 1:', part1);

galaxies = []; // reset
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == '#') {
            galaxies.push(new Pos(x, y));
        }
    }
}

galaxies.sort((a, b) => a.y - b.y); // sort by y
for (let index of expandedRowIndexes) {
    for (let j = 0; j < galaxies.length; j++) {
        if (galaxies[j].y >= index) {
            galaxies[j].y += 1000000;
        }
    }
}
galaxies.sort((a, b) => b.y - a.y);
console.log(galaxies);

galaxies.sort((a, b) => a.x - b.x);
for (let index of expandedColIndexes) {
    for (let j = 0; j < galaxies.length; j++) {
        if (galaxies[j].x >= index) {
            galaxies[j].x += 1000000;
        }
    }
}

let part2 = 0;
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        let dx = Math.abs(galaxies[i].x - galaxies[j].x);
        let dy = Math.abs(galaxies[i].y - galaxies[j].y);
        part2 += dx + dy;
    }
}

// 640489502522 too low
// 640488862042 too low
console.log('Part 2:', part2);