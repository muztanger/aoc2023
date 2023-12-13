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
input = example;

class Item {
    constructor(type, length) {
        this.type = type;
        this.length = length;
    }

    matches(str, index) {
        str = str.substring(index);
        if (str.length < this.length) {
            return false;
        }
        // .split('').forEeach((c, index) => {
        //     if (c !== '?' && c !== this.type) {
        //         return false;
        //     }
        // });
        return true;
    }
}

function count(items, i, spring, s) {
    if (i >= items.length) {
        return 0;
    }
    let count = 0;
    

    return count;
}

for (const line of input.split('\n').map(x => x.trim()).filter(line => line.length > 0)) {
    const [spring, groupsStr] = line.split(/\s+/);
    const groups = groupsStr.split(',').map(group => parseInt(group));
    const items = [];
    groups.forEeach((size, index) => {
        if (index > 0) {
            items.push(new Item('.', 1));
        }
        items.push(new Item('#', size));
    });

    var x = count(items, 0, spring, 0);
    console.log(spring, groups);
}