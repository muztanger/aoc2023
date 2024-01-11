const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');
const { performance } = require('perf_hooks');
const inspector = require('inspector');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
const example = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    abs() {
        return Math.abs(this.x) + Math.abs(this.y);
    }
    toString() {
        return this.x + ',' + this.y;
    }
    clone() {
        return new Pos(this.x, this.y);
    }
}

/* MinHeap minimised - taken from https://stackoverflow.com/a/66511107/5459839 */
const MinHeap={siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};
class PriorityQueue {
    constructor() {
        this.heap = [];
    }
    enqueue(value, priority) {
        MinHeap.push(this.heap, [priority, value]);
    }
    dequeue() {
        if (this.heap.length === 0) {
            return null;
        }
        return MinHeap.pop(this.heap)[1];
    }
    get length() {
        return this.heap.length;
    }
}

test('PriorityQueue', () => {
    let queue = new PriorityQueue();
    queue.enqueue('a', 3);
    queue.enqueue('b', 2);
    queue.enqueue('c', 1);
    assert.strictEqual(queue.dequeue(), 'c');
    assert.strictEqual(queue.dequeue(), 'b');
    assert.strictEqual(queue.dequeue(), 'a');
    assert.strictEqual(queue.dequeue(), null);

    queue.enqueue('a', 3);
    queue.enqueue('b', 2);
    queue.enqueue('c', 1);
    queue.enqueue('d', 2);
    queue.enqueue('e', 3);
    assert.strictEqual(queue.dequeue(), 'c');
    assert.strictEqual(['b', 'd'].includes(queue.dequeue()), true);
    assert.strictEqual(['b', 'd'].includes(queue.dequeue()), true);
    assert.strictEqual(queue.dequeue(), 'a');
    assert.strictEqual(queue.dequeue(), 'e');

});

const debug = inspector.url() !== undefined;

function part1(input) {
    const G = input.split('\n').map(line => line.split('').map(c => parseInt(c)));
    const R = G.length;
    const C = G[0].length;
    const D = new Map();
    const end = new Pos(C - 1, R - 1);
    
    const RIGHT = new Pos(1, 0);
    const DOWN = new Pos(0, 1);
    const LEFT = new Pos(-1, 0);
    const UP = new Pos(0, -1);

    let startTime = performance.now();

    let queue = new PriorityQueue();
    queue.enqueue({ pos: new Pos(0, 0), direction: -1, count: 0, energy: 0 }, 0);

    while (queue.length > 0) {
        let state = queue.dequeue();

        const key = state.pos.toString() + ',' + state.direction + ',' + state.count;
        if (D.has(key)) {
            continue;
        }
        D.set(key, state.energy);

        for (let i = 0; i < 4; i++) {
            if ((i + 2) % 4 === state.direction) continue;
            if (i == state.direction && state.count >= 3) continue;
            let dp = state.pos.add([LEFT, DOWN, RIGHT, UP][i]); 
            if (dp.x >= 0 && dp.x < C && dp.y >= 0 && dp.y < R) {
                let nextEnergy = state.energy + G[dp.y][dp.x];
                queue.enqueue({ pos: dp, direction: i, count: (i == state.direction ? state.count + 1: 1), energy: nextEnergy }, nextEnergy);
            }
        }

        if (performance.now() - startTime > 12000 && debug) {
            throw 'timeout';
        }
    }
    // console.log(D);
    let minEnergy = Infinity;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let key = end.toString() + ',' + i + ',' + j;
            if (D.has(key)) {
                minEnergy = Math.min(minEnergy, D.get(key));
                // console.log(key, D.get(key));
            }
        }
    }
    return minEnergy;
}

test('17-1 example', () => {
    assert.strictEqual(part1(example), 102);
});

test('17-1', () => {
    assert.strictEqual(part1(input), 638);
});

function part2(input) {
    const G = input.split('\n').map(line => line.split('').map(c => parseInt(c)));
    const R = G.length;
    const C = G[0].length;
    const D = new Map();
    const end = new Pos(C - 1, R - 1);
    
    const RIGHT = new Pos(1, 0);
    const DOWN = new Pos(0, 1);
    const LEFT = new Pos(-1, 0);
    const UP = new Pos(0, -1);

    let startTime = performance.now();

    let queue = new PriorityQueue();
    queue.enqueue({ pos: new Pos(0, 0), direction: -1, count: 0, energy: 0 }, 0);

    while (queue.length > 0) {
        let state = queue.dequeue();

        const key = state.pos.toString() + ',' + state.direction + ',' + state.count;
        if (D.has(key)) {
            continue;
        }
        D.set(key, state.energy);

        for (let i = 0; i < 4; i++) {
            if ((i + 2) % 4 === state.direction) continue; // can't turn around

            let dp = state.pos.add([LEFT, DOWN, RIGHT, UP][i]); 

            if (dp.x >= 0 && dp.x < C && dp.y >= 0 && dp.y < R) { // can't go off the grid
                let nextCount = i == state.direction ? state.count + 1 : 1;
                const nextKey = dp.toString() + ',' + i + ',' + nextCount;
                if (D.has(nextKey)) { // already been here
                    continue;
                }
                let nextEnergy = state.energy + G[dp.y][dp.x];
                if ((i == state.direction || state.direction < 0) && state.count < 4) { // need to keep going straight
                    queue.enqueue({ pos: dp, direction: i, count: nextCount, energy: nextEnergy }, nextEnergy);
                    continue;
                }
                if (state.count >= 4 && state.count <= 10) { // we can go straight again or turn
                    queue.enqueue({ pos: dp, direction: i, count: nextCount, energy: nextEnergy }, nextEnergy);
                }
            }
        }

        if (performance.now() - startTime > 12000 && debug) {
            throw 'timeout';
        }
    }
    // console.log(D);
    let minEnergy = Infinity;
    for (let i = 0; i < 4; i++) {
        for (let j = 4; j <= 10; j++) {
            let key = end.toString() + ',' + i + ',' + j;
            if (D.has(key)) {
                minEnergy = Math.min(minEnergy, D.get(key));
                // console.log(key, D.get(key));
            }
        }
    }
    return minEnergy;
}


test('17-2 example', () => {
    assert.strictEqual(part2(example), 94);
});

test('17-2 example 2', () => {
    assert.strictEqual(part2(`111111111111
999999999991
999999999991
999999999991
999999999991`), 71);
});

test('17-2', () => {
    assert.strictEqual(part2(input), 748);
});