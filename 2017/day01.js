function day01a(input) {
    var sum = 0;
    var last = -1;
    var match = false;
    for (var c of input.split('')) {
        var x = parseInt(c);
        if (x === last) {
            sum += x;
        }
        last = parseInt(c);
    }
    if (last === parseInt(input[0])) {
        sum += last;
    }
    return sum;
}

function day01b(input) {
    var sum = 0;
    var last = -1;
    var match = false;
    var arr = input.split('');
    for (var i = 0; i < arr.length; i++) {
        var x = parseInt(arr[i]);
        var y = parseInt(arr[(i + arr.length / 2) % arr.length]);
        if (x === y) {
            sum += x;
        }
    }
    return sum;
}

console.log(day01a('1122'));
console.log(day01a('1111'));
console.log(day01a('1234'));
console.log(day01a('91212129'));

console.log(day01a('<redacted>'));


console.log(day01b('1212'));
console.log(day01b('1221'));
console.log(day01b('123425'));
console.log(day01b('123123'));
console.log(day01b('12131415'));

console.log(day01b('<redacted>'));
