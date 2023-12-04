const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('../utilities.js');

var input = fs.readFileSync("2018/"+path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
input = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`;

class Guard {
    constructor(id) {
        this.id = id;
        this.sleep = 0;
        this.minutes = new Array(60).fill(0);
    }
}

class Event {
    constructor(time, timeString, action) {
        this.time = time;
        this.timeString = timeString;
        this.action = action;
    }
}

var events = [];
for (const line of input.split('\n')) {
    var time = new Date(line.split(']')[0].replace('[', '').replace(' ', 'T') + ":00.000Z");
    var action = line.split(']')[1].trim();
    events.push(new Event(time, line.split(']')[0].replace('[',''), action));
}

// sort events by time
events.sort((a, b) => a.time - b.time);

var guards = new Map();
var guard = null;
var start = null;
for (const event of events) {
    console.log(event.timeString, event.action);
    if (action.startsWith('Guard')) {
        var id = action.split(' ')[1].replace('#', '');
        if (!guards.has(id)) {
            guards.set(id, new Guard(id));
        }
        guard = guards.get(id);
    } else if (action.startsWith('falls') && guard != null) {
        start = time;
        // console.log("start:", start);
    } else if (action.startsWith('wakes') && guard != null && start != null) {
        var end = time;
        var sleep = end - start;
        console.log(guard.id, start, end, sleep);
        guard.sleep += sleep;
        for (var j = start; j < end; j++) {
            guard.minutes[j % 60]++;
        }
        start = null;
    }

}

console.log(guards);

var guard = Array.from(guards.values()).sort((a, b) => b.sleep - a.sleep)[0];
console.log(guard.minutes);
var minute = guard.minutes.indexOf(Math.max(...guard.minutes));
console.log(guard.id * minute, guard.id, minute);