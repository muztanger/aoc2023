const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;
// input = example;

let grids = input.split('\n\n').map(grid => grid.split('\n').map(line => line.split('')));

function checkHorizontalReflection(grid) {
    let hReflection = -1;
    for (let i = 1; i < grid.length; i++) {
        let r1 = i - 1;
        let r2 = i;
        let reflectCount = 0;
        while (r1 >= 0 && r2 < grid.length) {
            let isReflect = true;
            for (let c = 0; c < grid[i].length; c++) {
                if (grid[r1][c] !== grid[r2][c]) {
                    isReflect = false;
                    break;
                }
            }
            if (isReflect) {
                reflectCount++;
            } else {
                break;
            }
            r1--;
            r2++;
        }
        // console.log(i, reflectCount);
        if (i - reflectCount === 0 || i + reflectCount === grid.length) {
            hReflection = i;
            break;
        }
    }
    return hReflection;
}

function checkVerticalReflection(grid) {
    let vReflection = -1;
    for (let i = 1; i < grid[0].length; i++) {
        let c1 = i - 1;
        let c2 = i;
        let reflectCount = 0;
        while (c1 >= 0 && c2 < grid[0].length) {
            let isReflect = true;
            for (let r = 0; r < grid.length; r++) {
                if (grid[r][c1] !== grid[r][c2]) {
                    isReflect = false;
                    break;
                }
            }
            if (isReflect) {
                reflectCount++;
            } else {
                break;
            }
            c1--;
            c2++;
        }
        // console.log(i, reflectCount);
        if (i - reflectCount === 0 || i + reflectCount === grid[0].length) {
            vReflection = i;
            break;
        }
    }
    return vReflection;
}

let reflections = [];
let part1 = 0;
for (const grid of grids) {
    let hReflection = checkHorizontalReflection(grid);
    if (hReflection > 0) {
        part1 += 100 * hReflection;
    }
    let vReflection = checkVerticalReflection(grid);
    if (vReflection > 0) {
        part1 += vReflection;
    }
    reflections.push([hReflection, vReflection]);
}

console.log("Part 1:", part1);
test('Part 1', () => {
    assert.strictEqual(part1, 26957);
});

function checkHorizontalReflectionWithSmudge(grid) {
    let hReflection = -1;
    for (let i = 1; i < grid.length; i++) {
        let r1 = i - 1;
        let r2 = i;
        let diff = 0;
        while (r1 >= 0 && r2 < grid.length) {
            for (let c = 0; c < grid[i].length; c++) {
                if (grid[r1][c] !== grid[r2][c]) {
                    diff++;
                }
            }
            r1--;
            r2++;
        }
        if (diff == 1) {
            return i;
        }
    }
    return hReflection;
}

function checkVerticalReflectionWithSmudge(grid) {
    let vReflection = -1;
    for (let i = 1; i < grid[0].length; i++) {
        let c1 = i - 1;
        let c2 = i;
        let diff = 0;
        while (c1 >= 0 && c2 < grid[0].length) {
            for (let r = 0; r < grid.length; r++) {
                if (grid[r][c1] !== grid[r][c2]) {
                    diff++;
                }
            }
            c1--;
            c2++;
        }
        if (diff == 1) {
            return i;
        }
    }
    return vReflection;
}

let part2 = 0;
for (const grid of grids) {
    let hReflection = checkHorizontalReflectionWithSmudge(grid);
    if (hReflection > 0) {
        part2 += 100 * hReflection;
    }
    let vReflection = checkVerticalReflectionWithSmudge(grid);
    if (vReflection > 0) {
        part2 += vReflection;
    }
    reflections.push([hReflection, vReflection]);
}

// 30551 is too low
// 39178 is too low
// 57591 is too high
console.log("Part 2:", part2);
test('Part 2', () => {
    assert.strictEqual(part2, 42695);
});