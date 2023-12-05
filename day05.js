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

    toString() {
        return `${this.source} -> ${this.destination} (${this.transforms.length})`;
    }
}

class Transform {
    constructor(destination, source, range) {
        this.source = source;
        this.destination = destination;
        this.range = range;
    }

    transform(x) {
        if (x >= this.source && x < this.source + this.range) {
            return this.destination + (x - this.source);
        }
        return x;
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
console.log(items);
while (isUpdate) {
    isUpdate = false;
    map = maps.find(x => x.source == itemType);
    if (map) {
        console.log(map);
        var str = items.join(' ') + ' -> ';
        items = items.map(x => map.transform(x));
        console.log(str + items.join(' '));
        itemType = map.destination;
        isUpdate = true;
    }
}
var part1 = Math.min(...items);
console.log(part1);