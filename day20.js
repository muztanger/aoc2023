const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

class Module {
    static types = {"%":"FlipFlop", "&":"Conjunction", "broadcaster":"Broadcaster"};

    constructor() {
        this.type = "Unknown";
    }

    static parse(input) {
        var result = new Module();
        const [moduleType, ...args] = input.split(' ');
        var prefix = "";

        for (const [k, v] of Object.entries(this.types)) {
            if (moduleType.startsWith(k)) {
                prefix = k;
                result.type = v;
            }
        }

        if (moduleType === "broadcaster") {
            result.name = "Broadcaster";
        } else {
            result.name = moduleType.substring(prefix.length);
        }

        if (result.type === "FlipFlop") {
            result.switch = false;
        } else if (result.type === "Conjunction") {
            result.remember = "low pulse";
        }

        if (args.includes("->")) {
            result.connections = args.splice(args.indexOf("->") + 1);
            result.connections = result.output.map((s) => s.replace(/,/g, ''));
        }
        return result;
    }

    pulse() {
        if (this.type === "Broadcaster") {
            for (const connection of this.connections) {
                modules.get(connection).pulse();
            }
        } else if (this.type === "FlipFlop") {
            // Flip-flop modules (prefix %) are either on or off;
            //they are initially off. If a flip-flop module receives a high pulse, it is ignored and nothing happens. 
            //However, if a flip-flop module receives a low pulse, it flips between on and off. 
            //If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.

        } else if (this.type === "Conjunction") {
            // TODO
        }
    }
}

var modules = new Map();
for (const line of input.split('\n')) {
    var module = Module.parse(line);
    modules.set(module.name, module);
}

console.log(modules);

