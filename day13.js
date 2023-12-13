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

let part1 = 0;
for (const grid of grids) {
    // check horizontal reflection
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
    // check vertical reflection
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
    console.log("hReflection", hReflection, "vRflection", vReflection);
    if (hReflection > 0) {
        part1 += 100 * hReflection;
    }
    if (vReflection > 0) {
        part1 += vReflection;
    }
}
// 27030 not correct
console.log("Part 1:", part1);