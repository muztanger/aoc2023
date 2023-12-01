var banks = "4	1	15	12	0	9	9	5	5	8	7	3	14	5	12	3".split("\t").map(x => parseInt(x));
// var banks = "0	2	7	0".split("\t").map(x => parseInt(x));
var configurations = {}

var next = function() {
    var maxIndex = banks.indexOf(Math.max(...banks));
    var blocks = banks[maxIndex];
    for (var i = 0; i < blocks; i++) {
        banks[(maxIndex + i + 1) % banks.length]++;
        banks[maxIndex]--;
    }
    // console.log(banks.join());
}

var count = 1;
configurations[banks.join()] = count;
next();
while (configurations[banks.join()] == undefined) {
    count++;
    configurations[banks.join()] = count;
    next();
}

console.log(count); // part1
console.log(count - configurations[banks.join()] + 1); // part2