const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

let useExample = 1;
if (useExample === 1) {
    input = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;
} else if (useExample === 2) {
    input = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;
}

class Pulse {
    constructor(isHigh, caller, connection) {
        this.isHigh = isHigh;
        this.caller = caller;
        this.connection = connection;
    }
}

class Module {
    static types = {"%":"FlipFlop", "&":"Conjunction", "broadcaster":"Broadcaster"};

    constructor() {
        this.type = "Unknown";
        this.highCount = 0;
        this.lowCount = 0;
    }

    static parse(input, modules) {
        var result = new Module();
        result.modules = modules;

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
        
        if (args.includes("->")) {
            result.connections = args.splice(args.indexOf("->") + 1);
            result.connections = result.connections.map((s) => s.replace(/,/g, ''));
        }

        if (result.type === "FlipFlop") {
            result.switch = false;
        } else if (result.type === "Conjunction") {
            result.remember = {};
            for (const connection of result.connections) {
                result.remember[connection] = "low pulse";
            }
            //console.log(result.remember);
        }

        return result;
    }

    /**
     * 
     * @param {boolean} isHigh 
     * @param {Module} caller 
     * @returns {Pulse[]} further pulses to send
     */
    pulse(isHigh, caller) {
        if (isHigh) {
            this.highCount++;
        } else {
            this.lowCount++;
        }
        console.log(`${caller ? caller.name : "unknown"} ${isHigh ? "high" : "low"}  -> ${this.name}`);

        var result = [];

        if (this.type === "Broadcaster") {
            for (const connection of this.connections) {
                result.push(new Pulse(isHigh, this, connection));
            }
        } else if (this.type === "FlipFlop") {
            // If a flip-flop module receives a high pulse, it is ignored and nothing happens. 
            if (isHigh) return result;

            // However, if a flip-flop module receives a low pulse, it flips between on and off. 
            // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
            this.switch = !this.switch;

            for (const connection of this.connections) {
                result.push(new Pulse(this.switch, this, connection));
            }
        } else if (this.type === "Conjunction") {
            // remember the type of the most recent pulse received from each of their connected input modules;
            // they initially default to remembering a low pulse for each input.

            // When a pulse is received, the conjunction module first updates its memory for that input.
            // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
            if (isHigh) {
                this.remember[caller.name] = "high pulse";
            } else {
                this.remember[caller.name] = "low pulse";
            }
            
            console.log(`Module ${this.name} remembers ${JSON.stringify(this.remember)}`);
            let pulse = !Object.values(this.remember).includes("low pulse");
            for (const connection of this.connections) {
                result.push(new Pulse(pulse, this, connection));
            }
        }

        return result;
    }

}

var modules = new Map();
for (const line of input.split('\n')) {
    var module = Module.parse(line, modules);
    modules.set(module.name, module);
}

// press button
function press() {
    let button = new Module();
    button.name = "Button";
    let pulses = modules.get("Broadcaster").pulse(false, button);
    while (pulses.length > 0) {
        let newPulses = [];
        for (const pulse of pulses) {
            // console.log(`Pulse ${pulse.isHigh ? "high" : "low"} from ${pulse.caller.name} to ${pulse.connection}`);
            if (pulse.connection === "output") continue; // Testing purposes only

            let module = modules.get(pulse.connection);
            let morePulses = module.pulse(pulse.isHigh, pulse.caller);
            //console.log(`Module ${module.name} will send ${morePulses.length} pulses`);
            morePulses.forEach((p) => newPulses.push(p));
        }
        pulses = newPulses;
    }
}

press();

let totalHigh = [...modules.values()].reduce((acc, module) => acc + module.highCount, 0);
let totalLow = [...modules.values()].reduce((acc, module) => acc + module.lowCount, 0);

console.log(`Total high: ${totalHigh}`);
console.log(`Total low: ${totalLow}`);
console.log(`Multiplied: ${totalHigh * totalLow}`);

