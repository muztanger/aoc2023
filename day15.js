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
    assert.strictEqual(part1(input), -1);
})


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