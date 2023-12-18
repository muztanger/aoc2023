const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

var input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

var example = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;
let useExample = false;
if (useExample) {
    input = example;
}

var split = input.split('\n\n');
var items = split[0].trim().split(' ').slice(1).map(x => parseInt(x));

let category = "seed";

class Range {
    constructor(start, range) {
        this.start = start;
        this.range = range;
        this.end = start + range - 1;
    }

    overlaps(other) {
        return this.intersection(other) != null;
    }

    intersection(other) {
        var start = Math.max(this.start, other.start);
        var end = Math.min(this.end, other.end);
        if (start < end) {
            return new Range(start, end - start + 1);
        }
        return null;
    }

    remainders(other) {
        var result = [];
        // other --****---
        // this  ---**----
        // 
        //       --*--*----
        var intersection = this.intersection(other);
        // console.log("remainders:\n   ", this, "\nother:\n   ", other, "\nintersection:\n   ", intersection);
        if (other.start < intersection.start) {
            result.push(new Range(other.start, intersection.start - other.start));
        }
        if (other.end > intersection.end) {
            result.push(new Range(intersection.end + 1, other.end - intersection.end));
        }
        // console.log("result:\n   ", result);
        return result;
    }

    toString() {
        return `[${this.start}, ${this.end}]`;
    }
}

test('Range', () => {
    /// check overlaps
    assert.ok(new Range(0, 10).overlaps(new Range(5, 10)));
    assert.ok(new Range(5, 10).overlaps(new Range(0, 10)));
    assert.ok(new Range(0, 10).overlaps(new Range(0, 10)));
    assert.ok(new Range(0, 10).overlaps(new Range(0, 5)));
    assert.ok(new Range(0, 10).overlaps(new Range(5, 5)));

    // check non-overlaps
    assert.ok(!new Range(0, 10).overlaps(new Range(10, 10)));
    assert.ok(!new Range(0, 10).overlaps(new Range(11, 10)));
    assert.ok(!new Range(0, 10).overlaps(new Range(20, 10)));
    assert.ok(!new Range(0, 10).overlaps(new Range(-10, 10)));

    // check intersection start
    assert.equal(new Range(0, 10).intersection(new Range(5, 10)).start, 5);
    assert.equal(new Range(5, 10).intersection(new Range(0, 10)).start, 5);
    assert.equal(new Range(0, 10).intersection(new Range(0, 10)).start, 0);
    assert.equal(new Range(0, 10).intersection(new Range(0, 5)).start, 0);

    // check intersection end
    assert.equal(new Range(0, 10).intersection(new Range(5, 10)).end, 9);
    assert.equal(new Range(5, 10).intersection(new Range(0, 10)).end, 9);
    assert.equal(new Range(0, 10).intersection(new Range(0, 10)).end, 9);
    assert.equal(new Range(0, 10).intersection(new Range(0, 5)).end, 4);

    // check intersection range
    assert.equal(new Range(0, 10).intersection(new Range(5, 10)).range, 5);
    assert.equal(new Range(5, 10).intersection(new Range(0, 10)).range, 5);
    assert.equal(new Range(0, 10).intersection(new Range(0, 10)).range, 10);
    assert.equal(new Range(0, 10).intersection(new Range(0, 5)).range, 5);

    // check remainders
    assert.deepStrictEqual(new Range(0, 10).remainders(new Range(5, 10)), [new Range(10, 5)]);
    assert.deepStrictEqual(new Range(5, 10).remainders(new Range(0, 10)), [new Range(0, 5)]);
    assert.strictEqual(new Range(0, 10).remainders(new Range(0, 10)).length, 0);
    assert.strictEqual(new Range(0, 10).remainders(new Range(0, 5)).length, 0);

});

class GrowMap {
    constructor() {
        this.source = "";
        this.destination = "";
        this.transforms = [];
    }

    static parse(data) {
        var result = new GrowMap();
        var lines = data.split('\n');

        var [source, _, destination] = lines[0].replace('map:','').trim().split('-');
        // console.log(source, destination);
        result.source = source;
        result.destination = destination;
        for (var line of lines.slice(1)) {
            var [destinationStart, sourceStart, range] = line.trim().match(/\d+/g).map(x => parseInt(x));
            result.transforms.push(new Transform(destinationStart, sourceStart, range));
        }
        return result;
    }

    transform(x) {
        for (var transform of this.transforms) {
            if (x >= transform.source && x < transform.source + transform.range) {
                x = transform.transform(x);
                break;
            }
        }
        return x;
    }

    /**
     * 
     * @param {Range} range 
     * @returns {Range[]}
     */
    transformRange(range) {
        let result = [];

        var stack = [range];
        while (stack.length > 0) {
            let range = stack.pop();
            let isFound = false;
            for (let transform of this.transforms) {
                if (!transform.overlapsSourceRange(range)) continue;
                let transformResult = transform.transformRange(range);
                transformResult.transforms.forEach(x => result.push(x));
                transformResult.remainders.forEach(x => stack.push(x));
                isFound = true;
                break;
            }
            if (!isFound) {
                result.push(range);
            }
        }
     
        return result;
    }

    toString() {
        return `${this.source} -> ${this.destination} (${this.transforms.length})`;
    }
}

class Transform {
    constructor(destination, source, range) {
        this.source = source;
        this.destination = destination;
        this.range = range;
        this.sourceRange = new Range(source, range);
    }

    overlapsSourceRange(range) {
        return this.sourceRange.overlaps(range);
    }

    transform(x) {
        if (x >= this.source && x < this.source + this.range) {
            return this.destination + (x - this.source);
        }
        return x;
    }

    /**
     * 
     * @param {Range} other 
     * @returns {{transforms:Range[], remainders:Range[]}}
     */
    transformRange(other) {
        let result = {transforms:[], remainders:[]};
        if (this.sourceRange.overlaps(other)) {
            let intersection = this.sourceRange.intersection(other);
            result.transforms.push(new Range(this.transform(intersection.start), intersection.range));
            this.sourceRange.remainders(other).forEach(r => result.remainders.push(r));
        } else {
            result.remainders.push(other);
        }
        console.log("transformRange:\n", this, "\nother:\n", other, "\nresult:\n", result);
        return result;
    }

    toString() {
        return `${this.destination} <- ${this.source} #${this.range}`;
    }
}

var maps = [];
for (var mapData of split.slice(1)) {
    var map = GrowMap.parse(mapData);
    maps.push(map);
}

while (map = maps.find(x => x.source == category)) {
    items = items.map(x => map.transform(x));
    category = map.destination;
    isUpdate = true;
}
var part1 = Math.min(...items);
console.log(part1);

test('Part 1', () => {
    if (useExample) {
        assert.equal(part1, 35);
    } else {
        assert.equal(part1, 174137457);
    }
});

// Part 2
items = split[0].trim().split(' ').slice(1).map(x => parseInt(x));
var ranges = [];
for (var i = 0; i < items.length; i += 2) {
    ranges.push(new Range(items[i], items[i + 1]));
}

// console.log(ranges);

category = "seed";
// let index = 0;
// console.log("index: ", index++, "ranges: ", ranges);
while (map = maps.find(x => x.source == category)) {
    let newRanges = [];
    while (ranges.length > 0) {
        let range = ranges.pop();


        newRanges.push(...map.transformRange(range));
    }
    ranges = newRanges;
    category = map.destination;
}

var part2 = Math.min(...ranges.map(x => x.start));
console.log(part2);

test('Part 2', () => {
    if (useExample) {
        assert.equal(part2, 46);
    } else {
        // 4249618 is too high
        assert.notStrictEqual(part2, 4249618, "too high");
        assert.equal(part2, 1493866);
    }
});