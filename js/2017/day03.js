class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
    
class Square {
    constructor(pos, value) {
        this.pos = pos;
        this.value = value;
    }
}

function part1(input) {
    console.log('part1:' + input);
    var num = parseInt(input);
    var pos = new Pos(0, 0);
    var count = 1
    var dirs = [new Pos(0, -1), new Pos(-1, 0), new Pos(0, 1), new Pos(1, 0)];
    var dir = 0;
    if (num == 1) {
        return 0;
    }
    var x = 1;
    pos = new Pos(1,0);
    count = 2;
    while (count < num) {
        if (count < 1000) {
            console.log("count: " + count + " pos: " + pos.toString() + " dirs[dir]: " + dirs[dir] + " x: " + x);
        }
        pos = new Pos(pos.x + dirs[dir].x, pos.y + dirs[dir].y);
        if (pos.x == x && pos.y == x) {
            x = x + 1;
            dir = 3;
            pos = new Pos(pos.x + dirs[dir].x, pos.y + dirs[dir].y);
            count = count + 1;
            dir = 0;
        } else if (Math.abs(pos.x) == x && Math.abs(pos.y) == x) {
            dir = (dir + 1) % 4;
        }
        count = count + 1;
    }
    // pos = new Pos(pos.x + dirs[dir].x, pos.y + dirs[dir].y);
    return Math.abs(pos.x) + Math.abs(pos.y);
}

// console.log(part1(1));
// console.log(part1(12));
// console.log(part1(23));
// console.log(part1(29));
// console.log(part1(1024));
console.log(part1('redacted'));
