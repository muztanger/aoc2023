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

const example3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

// input = example3;

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

// const start = nodes['AAA']
// var current = start;
// var part1 = 0;
// var isTotalEnd = false;
// while (!isTotalEnd) {
//     for (const instruction of instructions.split('')) {
//         part1++;
//         // console.log(instruction, current.name, part1);
//         if (instruction === 'L') {
//             current = current.left;
//         } else {
//             current = current.right;
//         }
//         if (current.name === 'ZZZ') {
//             isTotalEnd = true;
//             break;
//         }
//     }
// }
// console.log(part1);

class Ghost {
    constructor(start) {
        this.start = start;
        this.current = start;
        this.init = -1;
        this.loop = -1;
    }

    reset() {
        this.current = this.start;
        this.init = -1;
        this.loop = -1;
    }

    move(instruction) {
        if (instruction === 'L') {
            this.current = this.current.left;
        } else {
            this.current = this.current.right;
        }
    }

    peek(instruction) {
        if (instruction === 'L') {
            return this.current.left;
        } else {
            return this.current.right;
        }
    }

    isEnd() {
        return this.current.name[2] === 'Z';
    }
}

// find all ghosts
const ghosts = [];
for (var key in nodes) {
    const node = nodes[key];
    if (node.name[2] === 'A') {
        ghosts.push(new Ghost(node));
    }
}

//                                       v
// g1: ------S------L------L------L------L------
// g2: --S---L---L---L---L---L---L---L---L---L---L---

// count ends per ghost
for (const ghost of ghosts) {
    var endCount = 0;
    var isEnd = false;
    var index = 0;
    var visited = new Set();
    while (!visited.has(ghost.current)) {
        visited.add(ghost.current);
        ghost.move(instructions[index]);
        if (ghost.isEnd()) {
            endCount++;
        }
        index = (index + 1) % instructions.length;
    }
    console.log(ghost.current.name, endCount);
}
return;
// reset ghosts
ghosts.forEach(g => g.reset());

// Find all loops
// for (const ghost of ghosts) {
//     var loopFound = false;
//     var index = 0;
//     var visited = new Set();
//     visited.add(ghost.current);
//     while (!loopFound) {
//         if (visited.has(ghost.peek(instructions[index]))) {
//             loopFound = true;
//         }
//         ghost.move(instructions[index]);
//         visited.add(ghost.current);

//         ghost.init++;
        
//         index = (index + 1) % instructions.length;
//     }
// }

var part2 = 0;
var isTotalEnd = false;
while (!isTotalEnd) {
    part2++;
    var endCount = 0;
    for (const ghost of ghosts) {
        ghost.move(instructions[(part2 - 1) % instructions.length]);
        if (ghost.isEnd()) {
            endCount++;
        }
    }
    if (endCount === ghosts.length) {
        isTotalEnd = true;
    }
}
console.log(part2);