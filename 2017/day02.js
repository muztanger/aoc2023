var dayinput = `<redacted>`;

console.log(day02a(dayinput));
console.log(day02b(dayinput));

function day02a(input) {
    var sum = 0;
    for (var line of input.split('\n')) {
        var arr = line.split(/\s+/).map(x => parseInt(x));
        sum += Math.max(...arr) - Math.min(...arr);
    }

    console.log(sum);
}

function day02b(input) {
    var sum = 0;
    for (var line of input.split('\n')) {
        var arr = line.split(/\s+/).map(x => parseInt(x));
        for (var i = 0; i < arr.length; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (i === j) {
                    continue;
                }
                if (arr[i] % arr[j] === 0) {
                    sum += arr[i] / arr[j];
                } else if (arr[j] % arr[i] === 0) {
                    sum += arr[j] / arr[i];
                }
            }
        }
    }
    return sum;
}
