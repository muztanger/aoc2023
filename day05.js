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
// input = example;

var split = input.split('\n\n');
var items = split[0].trim().split(' ').slice(1).map(x => parseInt(x));

var itemType = "seed";

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
        var end = Math.min(this.this.end, other.end);
        if (start < end) {
            return new Range(start, end - start + 1);
        }
        return null;
    }

    remainders(other) {
        var start = Math.max(this.start, other.start);
        var end = Math.min(this.end, other.end);
        var result = [];
        // --****------
        // ----****----
        // 
        // --**--**----
        if (this.start != start) {
            let minStart = Math.min(this.start, other.start);
            result.push(new Range(minStart, start - minStart + 1));
        }
        if (this.end != other.end) {
            let maxEnd = Math.max(this.end, other.end);
            result.push(new Range(end, maxEnd - end + 1));
        }
        return result;
    }
}

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

    transformRange(x, xRange) {
        var result = [];
        if (xRange <= 0) return result;

        var stack = [[x, xRange]];
        while (stack.length > 0) {
            var [y, yRange] = stack.pop();
            for (var transform of this.transforms) {
                var yStart = Math.max(y, transform.source);
                var yEnd = Math.min(y + yRange, transform.source + transform.range);
                if (yStart >= yEnd) continue;

                var intersections = transform.transformRange(y, yRange);
                if (intersections.length == 1) {
                    result.push(intersections[0]);
                } else {
                    intersections.forEach(x => stack.push(x));
                }
                break;
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

    transform(x) {
        if (x >= this.source && x < this.source + this.range) {
            return this.destination + (x - this.source);
        }
        return x;
    }

    transformRange(other) {
        result = [];     
        if (this.sourceRange.overlaps(other)) {
            result.push(this.sourceRange.intersection(ohter));
            result.concat(this.sourceRange.remainders(other));
        }
        var xStart = Math.max(x, this.source);
        var xEnd = Math.min(x + xRange, this.source + this.range);
        var xRange = xEnd - xStart;
        if (xRange > 0) {
            result.push([this.destination + (xStart - this.source), xRange]);
        }
        if (xStart < x) {
            result.push(new Range(x, xStart - x));
        }
        if (xEnd < x + xRange) {
            result.push([xEnd, x + xRange - xEnd]);
        }
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

isUpdate = true;
// console.log(items);
while (isUpdate) {
    isUpdate = false;
    map = maps.find(x => x.source == itemType);
    if (map) {
        // console.log(map);
        var str = items.join(' ') + ' -> ';
        items = items.map(x => map.transform(x));
        // console.log(str + items.join(' '));
        itemType = map.destination;
        isUpdate = true;
    }
}
var part1 = Math.min(...items);
console.log(part1);

// Part 2
items = split[0].trim().split(' ').slice(1).map(x => parseInt(x));

while (isUpdate) {
    isUpdate = false;
    map = maps.find(x => x.source == itemType);
    if (map) {
        // console.log(map);
        var str = items.join(' ') + ' -> ';
        for (var i = 0; i < items.length; i += 2) {

        }
        items = items.map(x => map.transform(x));
        // console.log(str + items.join(' '));
        itemType = map.destination;
        isUpdate = true;
    }
}
