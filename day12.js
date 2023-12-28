const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const { group } = require('node:console');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;
let useExample = true;
if (useExample) {
    input = example;
}
let part1 = 0;
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    const [spring, groupsStr] = line.split(/\s+/);
    const groups = groupsStr.split(',').map(group => parseInt(group));
    // generate all permutations of ?=. and ?=#
    let permutationsCount = 0;
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
            permutationsCount++;
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
    console.log(permutationsCount);
    part1 += permutationsCount;

    console.log(spring, groups);
}

console.log('Part 1:', part1);

let part2 = 0;
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);
    
    // Unfold the records
    spring = Array(5).fill(spring).join('?');
    groupsStr = Array(5).fill(groupsStr).join(',');
    console.log("unfolded line:", spring, groupsStr);

    let groups = groupsStr.split(',').map(group => parseInt(group));

    let permuteCallCount = 0;
    // generate all permutations of ?=. and ?=#
    const permutations = [];
    const permute = (prefix, suffix) => {
        permuteCallCount++;
        if (permuteCallCount > 1000000) {
            console.log("Too many permutations",prefix,suffix);
            return;
        }   
        if (suffix.length === 0) {
            // trim '.' from beginning and end of prefix
            let trimmed = prefix.replace(/^\.*|\.*$/g, '');
            let consecutive = countConsecutive(trimmed);
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
            part2++;
            return;
        }
        if (suffix[0] === '?') {
            // check if we can skip this permutation since it does not match the groups
            let trimmed = prefix.replace(/^\.*|\.*$/g, '');
            let consecutive = countConsecutive(trimmed);
            let i = 0;
            for (let n of consecutive.filter(([c, n]) => c === '#').map(([c, n]) => n)) {
                if (n > groups[i]) {
                    return;
                }
            }
            permute(prefix + '.', suffix.slice(1));
            permute(prefix + '#', suffix.slice(1));
            return;
        }
        permute(prefix + suffix[0], suffix.slice(1));

        function countConsecutive(trimmed) {
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
            return consecutive;
        }
    };
    permute('', spring);
}

console.log('Part 2:', part2);

