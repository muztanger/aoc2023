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

    toString() {
        return `${this.name} = (${this.left}, ${this.right})`;
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
        this.name = start.name;
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
    let endCount = 0;
    let index = 0;
    let visited = [];
    let loopLength = null;
    let loopStop = false;
    let i = 0;
    while (endCount <= 3) {
        let key = ghost.current.name + ":" + index + ":" + instructions[index];
        visited[key] = visited[key] || 0;
        visited[key]++;
        if (loopLength != null && !loopStop) {
            loopLength++;
        }
        ghost.move(instructions[index]);
        i++;
        if (ghost.isEnd()) {
            if (loopLength == null) {
                loopLength = 0;
            } else {
                loopStop = true;
            }
            endCount++;
        }
        index = (index + 1) % instructions.length;
    }
    ghost.loopLength = loopLength;
    ghost.totalSteps = Object.keys(visited).length;
    console.log(ghost.name, ghost.totalSteps, endCount, ghost.loopLength);
}

let gs = [];
for (const ghost of ghosts) {
    gs.push({
        'loopLength': BigInt(ghost.loopLength), 
        'remainder': BigInt(ghost.totalSteps - ghost.loopLength)
    });
}
console.log(gs);

let result = Array(ghosts.length).fill(0n);

// figure out when the ghosts will be in sync by using Chinese Remainder Theorem
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem

// find the greatest common divisor of all loop lengths
let gcd = gs[0].loopLength;
for (var i = 1; i < gs.length; i++) {
    gcd = ut.gcd(gcd, gs[i].loopLength);
}
console.log("loopLength gcd", gcd);

// find the lowest common multiple of all loop lengths
let lcm = gs[0].loopLength;
for (var i = 1; i < gs.length; i++) {
    lcm = ut.lcm(lcm, gs[i].loopLength);
}
console.log("loopLength lcm", lcm);

// find what step the ghosts will be in sync
let syncStep = 0n;
for (var i = 0; i < gs.length; i++) {
    syncStep += gs[i].loopLength * (lcm / gs[i].loopLength);
}

// find the remainder of the sync step
console.log("syncStep before", syncStep);
for (var i = 0; i < gs.length; i++) {
    console.log("remainder", gs[i].remainder, gs[i].loopLength, syncStep % gs[i].loopLength);
}

test('part2', () => {
    let p2 = lcm;
    console.log(p2);
    assert.ok(p2 != 73770992295, `${p2} is too low`);
    assert.ok(p2 != 3103294768385448350868n, `${p2} is incorrect`);
    assert.ok(p2 != 3103294768385448350869n, `${p2} is incorrect`);
    assert.equal(p2, 18215611419223n, `${p2}`);
});
