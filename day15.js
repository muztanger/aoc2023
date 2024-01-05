const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

function hash(str) {
    let current = 0;
    for (let i = 0; i < str.length; i++) {
        current = ((current + str.charCodeAt(i)) * 17) % 256;
    }
    return current;
}

function part1(input) {
    let result = 0;
    for (let step of input.split(',')) {
        result += hash(step);
    }
    return result;
}


test('part1', () => {
    assert.strictEqual(part1('rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'), 1320);
    assert.strictEqual(part1(input), 517551);
})

function part2(input) {
    const operRegex = /(\w+)([-=])(\d*)/;
    let boxes = Array(256).fill().map(() => []);
    for (let step of input.split(',')) {
        let [_, label, oper, value] = operRegex.exec(step);
        let boxIndex = hash(label);
        let box = boxes[boxIndex];
        if (oper === '-') {
            for (let i = 0; i < boxes.length; i++) {
                let indexOf = boxes[i].map(([x, y]) => x).indexOf(label);
                if (indexOf >= 0) {
                    boxes[i].splice(indexOf, 1);
                    // console.log(`Removed ${label} from box ${i} => ${boxes[i].map(([x, y]) => `[${x} ${y}]`).join(' ')}`);
                    break;
                }
            }
        } else if (oper === '=') {
            let labelIndex = box.map(([x, y]) => x).indexOf(label);
            if (labelIndex >= 0) {
                box[labelIndex][1] = value;
            } else {
                box.push([label, value]);
            }
        }
        // console.log("After: ", step);
        // for (let i = 0; i < boxes.length; i++) {
        //     if(boxes[i].length > 0) {
        //         console.log(`Box ${i}: ${boxes[i].map(([x, y]) => `[${x} ${y}]`).join(' ')}`);
        //     }
        // }
        // console.log();
    }
    let result = 0;
    let b = 1;
    for (let box of boxes) {
        let slot = 1;
        for (let [label, value] of box) {
            result += b * slot * value;
            slot++;
        }
        b++;
    }
    return result;
}

test('part2', () => {
    assert.strictEqual(part2('rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'), 145);
    assert.strictEqual(part2(input), 286097);
});


test('hash', () => {
    assert.strictEqual(hash(''), 0);
    assert.strictEqual(hash('HASH'), 52);
    assert.strictEqual(hash('rn=1'), 30);
    assert.strictEqual(hash('cm-'), 253);
    assert.strictEqual(hash('qp=3'), 97);
    assert.strictEqual(hash('cm=2'), 47);
    assert.strictEqual(hash('qp-'), 14);
    assert.strictEqual(hash('pc=4'), 180);
    assert.strictEqual(hash('ot=9'), 9);
    assert.strictEqual(hash('ab=5'), 197);
    assert.strictEqual(hash('pc-'), 48);
    assert.strictEqual(hash('pc=6'), 214);
    assert.strictEqual(hash('ot=7'), 231);
});