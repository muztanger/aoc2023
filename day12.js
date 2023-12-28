const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
let useExample = false;
if (useExample) {
    input = example;
}
let part1 = 0;
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    const [spring, groupsStr] = line.split(/\s+/);
    const groups = groupsStr.split(',').map(group => parseInt(group));
    // generate all permutations of ?=. and ?=#
    const permutations = [];
    const permute = (prefix, suffix) => {
        if (suffix.length === 0) {
            // trim '.' from beginning and end of prefix
            let trimmed = prefix.replace(/^\.*|\.*$/g, '');
            let consecutive = [];
            let last = '';
            for (const c of trimmed) {
                if (c === last) {
                    consecutive[consecutive.length - 1][1]++;
                } else {
                    consecutive.push([c, 1]);
                    last = c;
                }
            }
            if (consecutive.filter(([c, n]) => c === '#').length !== groups.length) {
                return;
            }
            let i = 0;
            for (let n of consecutive.filter(([c, n]) => c === '#').map(([c, n]) => n)) {
                if (n !== groups[i]) {
                    return;
                }
                i++;
            }
            permutations.push(prefix);
            return;
        }
        if (suffix[0] === '?') {
            permute(prefix + '.', suffix.slice(1));
            permute(prefix + '#', suffix.slice(1));
            return;
        }
        permute(prefix + suffix[0], suffix.slice(1));
    };
    permute('', spring);
    console.log(permutations.length);
    part1 += permutations.length;

    console.log(spring, groups);
}

console.log('Part 1:', part1);