const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

let input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });
let useExample = true;

if (useExample) {
  input = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}`;
}

input = input.split("\n\n");
console.log("work", input[0]);
console.log("parts", input[1]);

class Rule {
    constructor() {
        this.conditions = [];
    }
    
    static parse(input) {
        let result = new Rule();
        // a<2006:qkq
        let [condition, action] = input.split(':');
        result.action = action;
        let variable = condition.substring(0, condition.indexOf(/[<>=]/));
        return result;
    }
    
    check(conditions) {
        for (let condition of this.conditions) {
            if (!condition.check(conditions)) {
                return false;
            }
        }
        return true;
    }
}

class Workflow {
    constructor() {
        this.rules = {};
        this.parts = {};
    }
    
    static parse(input) {
        let result = new Workflow();
        //px{a<2006:qkq,m>2090:A,rfg}
        //pv{a>1716:R,A}
        let name = input.substring(0, input.indexOf('{'));
        for (let part of parts) {
            let [rule, part] = part.split(':');
            result.addRule(name, Rule.parse(rule));
        }
        return result;
    }

    addRule(name, rule) {
        this.rules[name] = rule;
    }
    
    addPart(name, part) {
        this.parts[name] = part;
    }
    
    run() {
        let changed = true;
        while (changed) {
        changed = false;
        for (let name in this.parts) {
            if (this.parts[name].run(this.rules)) {
            changed = true;
            }
        }
        }
    }
}