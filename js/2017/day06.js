var banks = "4	1	15	12	0	9	9	5	5	8	7	3	14	5	12	3".split("\t").map(x => parseInt(x));
var configurations = new Set();
configurations.add(banks.join());

var next = function() {
    var maxIndex = banks.indexOf(Math.max(...banks));
    var blocks = banks[maxIndex];
    for (var i = 0; i < blocks; i++) {
        banks[(maxIndex + i + 1) % banks.length]++;
        banks[maxIndex]--;
    }
    console.log(banks.join());
}

var count = 1;
next();
while (!configurations.has(banks.join())) {
    count++;
    configurations.add(banks.join());
    next();
}

console.log(count);