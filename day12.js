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
let useExample = false;
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

let part2 = BigInt(0);
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);
    
    // Unfold the records
    spring = Array(5).fill(spring).join('?');
    groupsStr = Array(5).fill(groupsStr).join(',');
    console.log("unfolded line:", spring, groupsStr);

    let groups = groupsStr.split(',').map(group => parseInt(group));

    let permuteCallCount = 0;
    let linePermutations = 0;
    // generate all permutations of ?=. and ?=#
    const permutations = [];
    const permute = (prefix, suffix) => {
        permuteCallCount++;
        // if (permuteCallCount > 100000000) {
        //     console.log("Too many permutations",prefix,suffix);
        //     return;
        // }
        let trimmed = prefix.replace(/^\.*/g, '');
        let consecutive = countConsecutive(trimmed).filter(([c, n]) => c === '#');
        if (consecutive.length > groups.length) {
            return;
        }
        if (suffix.length === 0) {
            if (consecutive.length !== groups.length) {
                return;
            }
            let i = 0;
            for (let n of consecutive.map(([c, n]) => n)) {
                if (n !== groups[i]) {
                    return;
                }
                i++;
            }
            part2++;
            linePermutations++;
            return;
        }
        if (suffix[0] === '?') {
            for (let [n, i] of consecutive.map(([c, n], i) => [n, i])) {
                if (i < consecutive.length - 1) {
                    if (n !== groups[i]) {
                        return;
                    } 
                } else {
                    if (n < groups[i] && prefix[prefix.length - 1] === '#') {
                        permute(prefix + '#', suffix.slice(1));
                        return;
                    } else if (n == groups[i] && prefix[prefix.length - 1] === '#') {
                        permute(prefix + '.', suffix.slice(1));
                        return;
                    } else if (n > groups[i]) {
                        return;
                    }
                }
            }
            permute(prefix + '.', suffix.slice(1));
            permute(prefix + '#', suffix.slice(1));
            return;
        }
        for (let [n, i] of consecutive.map(([c, n], i) => [n, i])) {
            if (i < consecutive.length - 1 && n !== groups[i]) {
                return;
            } else if (n < groups[i] && suffix[0] === '.') {
                return;
            } else if (n > groups[i] && suffix[0] === '#') {
                return;
            }
        }
        permute(prefix + suffix[0], suffix.slice(1));

    };
    var consecutiveMem = new Map();
    function countConsecutive(trimmed) {
        if (consecutiveMem.has(trimmed)) {
            return consecutiveMem.get(trimmed);
        }
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
        if (trimmed.length < Math.log2(1000000)) {
            consecutiveMem.set(trimmed, consecutive);
        }
        return consecutive;
    }
    permute('', spring);
    console.log("linePermutations", linePermutations);
}

console.log('Part 2:', part2);

