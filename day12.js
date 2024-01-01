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

class LimitedMap {
    constructor(limit) {
        this.limit = limit;
        this.map = new Map();
        this.keys = [];
    }

    set(key, value) {
        if (this.map.has(key)) {
            this.map.set(key, value);
            return;
        }
        if (this.keys.length >= this.limit) {
            let keyToRemove = this.keys.shift();
            this.map.delete(keyToRemove);
        }
        this.keys.push(key);
        this.map.set(key, value);
    }

    get(key) {
        return this.map.get(key);
    }

    has(key) {
        return this.map.has(key);
    }
}

const countConsecutiveMem = new LimitedMap(1000000);
function countConsecutive(trimmed) {
    if (countConsecutiveMem.has(trimmed)) {
        return countConsecutiveMem.get(trimmed);
    }
    let consecutive = [];
    let last = '';
    for (const c of trimmed) {
        if (c === '#') {
            if (c === last) {
                consecutive[consecutive.length - 1]++;
            } else {
                consecutive.push(1);
            }
        }
        last = c;
    }
    countConsecutiveMem.set(trimmed, consecutive);
    return consecutive;
}

var startPart1 = performance.now();
let part1 = BigInt(0);
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);
    let groups = groupsStr.split(',').map(group => parseInt(group));

    let linePermutations = 0;
    const permutations = [];
    const permute = (prefix, suffix) => {
        let trimmed = prefix.replace(/^\.*/g, '');
        let consecutive = countConsecutive(trimmed);
        if (consecutive.length > groups.length) {
            return;
        }
        if (suffix.length === 0) {
            if (consecutive.length !== groups.length) {
                return;
            }
            let i = 0;
            for (let n of consecutive) {
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
            for (let [n, i] of consecutive.map((n, i) => [n, i])) {
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
        for (let [n, i] of consecutive.map((n, i) => [n, i])) {
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


var endPart1 = performance.now();
console.log(`Time to run: ${endPart1 - startPart1}ms`);
console.log('Part 1:', part1);

test('part1', () => {
    if (useExample) {
        assert.strictEqual(part1, BigInt(21));
    } else {
        assert.strictEqual(part1, BigInt(7843));
    }
});


var startPart2 = performance.now();
let part2 = BigInt(0);
for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    let [spring, groupsStr] = line.split(/\s+/);

    // unfold the records
    spring = Array(5).fill(spring).join('?');
    groupsStr = Array(5).fill(groupsStr).join(',');
    let groups = groupsStr.split(',').map(group => parseInt(group));

    console.log(spring, groupsStr);

    let funMemories = new Map();
    function theFun(spring, groups, springIndex, groupIndex, count) {
        let key = `${springIndex},${groupIndex},${count}`;
        if (funMemories.has(key)) {
            return funMemories.get(key);
        }
        if (springIndex === spring.length) {
            if (groupIndex === groups.length && count == 0) {
                return 1;
            } else if (groupIndex === groups.length - 1 && count == groups[groupIndex]) {
                return 1;
            } else {
                return 0;
            }
        }
        let result = 0;
        for (let c of ['.', '#']) {
            if (spring[springIndex] === '?' || spring[springIndex] === c) {
                if (c == '.' && count == 0) {
                    result += theFun(spring, groups, springIndex + 1, groupIndex, 0);
                } else if (c == '.' && count > 0 && groupIndex < groups.length && groups[groupIndex] == count) {
                    result += theFun(spring, groups, springIndex + 1, groupIndex + 1, 0);
                } else if (c == '#') {
                    result += theFun(spring, groups, springIndex + 1, groupIndex, count + 1);
                }
            }
        }
        funMemories.set(key, result);
        return result;
    }
    let springCount = theFun(spring, groups, 0, 0, 0);
    part2 += BigInt(springCount);
    console.log("springCount", springCount);
}
var endPart2 = performance.now();

console.log('Part 2:', part2);
console.log(`Time to run Part 2: ${endPart2 - startPart2}ms`);

test('part2', () => {
    if (useExample) {
        assert.strictEqual(part2, BigInt(525152));
    } else {
        assert.strictEqual(part2, BigInt(-1));
    }
});