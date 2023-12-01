input = `redacted`;

function part1(input) {
    var lines = input.split('\n');
    var result = 0;
    for (line of lines) {
        var words = line.split(' ');
        var unique = new Set(words);
        if (unique.size == words.length) {
            result = result + 1;
        }
    }
    return result;
}
console.log(part1('aa bb cc dd ee\naa bb cc dd aa\naa bb cc dd aaa'));
console.log(part1(input));

function part2(input) {
    var lines = input.split('\n');
    var result = 0;
    for (var line of lines) {
        var words = line.split(' ');
        var unique = new Set(words.map(w => w.split('').sort().join('')));
        if (unique.size == words.length) {
            result = result + 1;
        }
    }
    return result;
}

console.log(part2(input));