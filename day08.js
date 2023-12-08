const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

var input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const example2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

// input = example2;

const instructions = input.split('\n\n')[0].trim();

class Node {
    constructor(name, left, right) {
        this.name = name;
        this.left = left;
        this.right = right;
    }

    static parse(input) {
        const [name, left, right] = input.split(/\W+/g).map(x => x.trim());
        // console.log(name, left, right);
        return new Node(name, left, right);
    }
}

nodes = [];
for (const line of input.split('\n\n')[1].trim().split('\n')) {
    const node = Node.parse(line);
    nodes[node.name] = node;
}

// fix up the left and right nodes
for (var key in nodes) {
    var node = nodes[key];
    // console.log(node);
    node.left = nodes[node.left];
    node.right = nodes[node.right];
}

const start = nodes['AAA']
var current = start;
var part1 = 0;
var isFound = false;
while (!isFound) {
    for (const instruction of instructions.split('')) {
        part1++;
        // console.log(instruction, current.name, part1);
        if (instruction === 'L') {
            current = current.left;
        } else {
            current = current.right;
        }
        if (current.name === 'ZZZ') {
            isFound = true;
            break;
        }
    }
}
console.log(part1);

