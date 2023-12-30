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

    // unfold the records
    spring = Array(5).fill(spring).join('?');
    groupsStr = Array(5).fill(groupsStr).join(',');
    let groups = groupsStr.split(',').map(group => parseInt(group));

    console.log(spring, groupsStr);

    // for each groups search for the first occurence of the pattern matching the first group
    let stack = [];
    stack.push({prefix: '', suffix: spring, groupIndex: 0});
    let springCount = 0;
    while (stack.length > 0) {
        if (stack.length > 100000) {
            console.log('stack overflow');
            for (let i = 0; i < 100; i++) {
                console.log(stack[i]);
            }
            break;
        }
        let {prefix, suffix, groupIndex} = stack.pop();
        if (groupIndex === groups.length) {
            part2++;
            springCount++;
            continue;
        }
        let group = groups[groupIndex];
        const regex = new RegExp(`[?#]{${group}}`);
        let index = suffix.regexIndexOf(regex);
        let isSkip = false;
        while (index >= 0 && !isSkip) {
            // replace the group with the pattern
            if (index + group == suffix.length || (index + group < suffix.length && suffix[index + group] !== '#')) {
                // if the remaining groups length does not fit into the suffix length, skip
                if (suffix.length - group < groups.slice(groupIndex + 1).reduce((acc, cur) => acc + cur + 1, -1)) {
                    isSkip = true;
                    break;
                }

                let nextPrefix = prefix + suffix.slice(0, index).replaceAll('?','.') + '#'.repeat(group) + ".";
                let trimmed = nextPrefix.replace(/^\.*|\?.*$/g, '');
                let consecutive = countConsecutive(trimmed).filter(([c, n]) => c === '#').map(([c, n]) => n);
                
                for (let i = 0; i < consecutive.length; i++) {
                    if (consecutive[i] !== groups[i]) {
                        isSkip = true;
                        break;
                    }
                }
                if (!isSkip) {
                    stack.push({prefix: nextPrefix, suffix: suffix.slice(index + group + 1), groupIndex: groupIndex + 1});
                }
            }
            index = suffix.regexIndexOf(regex, index + 1);
        }
    }
    console.log("springCount", springCount);
}

console.log('Part 2:', part2);