const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const { group } = require('node:console');
const { performance } = require('perf_hooks');

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

var start = performance.now();
let part1 = BigInt(0);
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);
    let groups = groupsStr.split(',').map(group => parseInt(group));

    let linePermutations = 0;
    const permutations = [];
    const permute = (prefix, suffix) => {
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
            part1++;
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
    permute('', spring);
}

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

var end = performance.now();
console.log(`Time to run: ${end - start}ms`);
console.log('Part 1:', part1);

test('part1', () => {
    if (useExample) {
        assert.strictEqual(part1, BigInt(21));
    } else {
        assert.strictEqual(part1, BigInt(7843));
    }
});


let part2 = BigInt(0);
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);

    let subSpringPermutations = new Map();
    const subSpring = spring;
    const subGroups = groupsStr.split(',').map(group => parseInt(group));

    let subSpringPermutation = new Set();
    const subPermute = (prefix, suffix) => {
        if (suffix.length === 0) {
            let trimmed = prefix.replace(/^\.*|\.*$/g, '');
            let consecutive = countConsecutive(trimmed).filter(([c, n]) => c === '#').map(([c, n]) => n);
            let i = 0;
            for (let n of consecutive) {
                if (n !== subGroups[i]) {
                    return;
                }
                i++;
            }
            subSpringPermutation.add([prefix, consecutive]);
            return;
        }
        if (suffix[0] === '?') {
            subPermute(prefix + '.', suffix.slice(1));
            subPermute(prefix + '#', suffix.slice(1));
            return;
        }
        subPermute(prefix + suffix[0], suffix.slice(1));
    };
    subPermute('', subSpring);
    subSpringPermutations.set(subSpring, subSpringPermutation);
    console.log(subSpringPermutations.get(subSpring));

    // unfold the records
    spring = Array(5).fill(spring).join('?');
    groupsStr = Array(5).fill(groupsStr).join(',');
    let groups = groupsStr.split(',').map(group => parseInt(group));

    console.log(spring, groupsStr);

    //TODO breadth first search for all possible combinations of subSprings and save as list of possible group combinations
    
    let linePermutations = 0;
    const permutations = [];
    let callCount = 0;
    const N = 1000000000;
    const permute = (prefix, suffix) => {
        callCount++;
        if (callCount > N - 100) {
            console.log("   prefix:", prefix, "suffix:", suffix);
        }
        if (callCount > N) {
            console.log('too many calls', prefix, suffix);
            return;
        }
        let trimmed = prefix.replace(/^\.*/g, '');
        let consecutive = countConsecutive(trimmed).filter(([c, n]) => c === '#');
        if (consecutive.length > groups.length) {
            return;
        }
        if (consecutive.length > 0 && consecutive.length < groups.length && consecutive[consecutive.length - 1][1] == groups[consecutive.length - 1]) {
            // check if we can fill in the rest with the remaining groups
            let remaining = groups.slice(consecutive.length);
            let remainingSum = remaining.reduce((a, b) => a + b, 0);
            remainingSum += remaining.length - 1; // add the dots
            if (remainingSum > suffix.length) {
                return;
            }
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
    permute('', spring);
    console.log('callCount', callCount, 'linePermutations', linePermutations);
}

console.log('Part 2:', part2);