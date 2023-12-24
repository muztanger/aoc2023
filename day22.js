const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ut = require('./utilities.js');

const input = fs.readFileSync(path.basename(__filename).replace(/\.js$/, '.in'), { encoding: 'utf8' });

class Pos {

    static ZERO = new Pos(0, 0, 0);

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(other) {
        return new Pos(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    sub(other) {
        return new Pos(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    mul(scalar) {
        return new Pos(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    cross(other) {
        return new Pos(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x,
        );
    }

    normalize() {
        const len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return new Pos(this.x / len, this.y / len, this.z / len);
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    intersects(other) {
        let v1 = this.end.sub(this.start);
        let v2 = other.end.sub(other.start);
        let v3 = other.start.sub(this.start);
      
        let v1CrossV2 = v1.cross(v2);
        let v1CrossV3 = v1.cross(v3);
        let v2CrossV3 = v2.cross(v3);

        if (v1CrossV2.dot(v1CrossV3) == 0 && v1CrossV2.dot(v2CrossV3) == 0) {
          return false;
        }
      
        var denominator = (v1.dot(v1) * v2.dot(v2)) - (v1.dot(v2) * v1.dot(v2));
        var ua = ((v2.dot(v2) * v1.dot(v3)) - (v1.dot(v2) * v2.dot(v3))) / denominator;
        var ub = ((v1.dot(v1) * v2.dot(v3)) - (v1.dot(v2) * v1.dot(v3))) / denominator;
      
        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          return true;
        } else {
          return false;
        }
      }
      
      
}

test('line add', () => {
    const a = new Pos(1, 2, 3);
    const b = new Pos(4, 5, 6);
    assert.deepEqual(a.add(b), new Pos(5, 7, 9));
});

test('line sub', () => {
    const a = new Pos(1, 2, 3);
    const b = new Pos(4, 5, 6);
    assert.deepEqual(a.sub(b), new Pos(-3, -3, -3));
});

test('line dot', () => {
    const a = new Pos(1, 2, 3);
    const b = new Pos(4, 5, 6);
    assert.equal(a.dot(b), 32);
});

test('line cross', () => {
    {
        const a = new Pos(1, 0, 0);
        const b = new Pos(0, 1, 0);
        assert.deepEqual(a.cross(b), new Pos(0, 0, 1));
    }
    {
        const a = new Pos(0, 1, 0);
        const b = new Pos(0, 0, 1);
        assert.deepEqual(a.cross(b), new Pos(1, 0, 0));
    }
    {
        const a = new Pos(0, 0, 1);
        const b = new Pos(1, 0, 0);
        assert.deepEqual(a.cross(b), new Pos(0, 1, 0));
    }
    {
        const a = new Pos(1, 2, 3);
        const b = new Pos(4, 5, 6);
        assert.deepEqual(a.cross(b), new Pos(-3, 6, -3));
    }
    {
        const a = new Pos(1, 0, 0);
        const b = new Pos(1, 0, 0);
        assert.deepEqual(a.cross(b), Pos.ZERO);
    }
    {
        const a = new Pos(0, 1, 0);
        const b = new Pos(0, 1, 0);
        assert.deepEqual(a.cross(b), Pos.ZERO);
    }
    {
        const a = new Pos(0, 0, 1);
        const b = new Pos(0, 0, 1);
        assert.deepEqual(a.cross(b), Pos.ZERO);
    }
    {
        const a = new Pos(1, 2, 3);
        const b = new Pos(1, 2, 3);
        assert.deepEqual(a.cross(b), Pos.ZERO);
    }
});

test('line intersection', () => {
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(1, 1, 0), new Pos(1, 0, 0));
        assert.ok(a.intersects(b));
    }
    // TODO check all tests below...
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 2, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, 1));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, -1));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, 2));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, -2));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, 3));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 1, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, -3));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(1, 0, 0));
        const b = new Line(new Pos(0, 1, 0), new Pos(1, 0, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(0, 1, 0));
        const b = new Line(new Pos(1, 0, 0), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(0, 1, 0));
        const b = new Line(new Pos(1, 0, 0), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(0, 1, 0));
        const b = new Line(new Pos(1, 0, 0), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Line(new Pos(0, 0, 0), new Pos(0, 1, 0));
        const b = new Line(new Pos(1, 0, 0), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
});

class Plane {
    constructor(pos, normal) {
        this.pos = pos;
        this.normal = normal.normalize();
    }

    intersects(line) {
        // normalize
        let linePos = line.start;
        let lineDirection = line.end.sub(line.start).normalize();

        if (this.normal.dot(lineDirection) === 0) {
            return false;
        }

        let t = (this.normal.dot(this.pos) - this.normal.dot(linePos)) / this.normal.dot(lineDirection);
        let intersectionPoint = linePos.add(lineDirection.normalize().mul(t));

        // check if intersectionPoint is within line bounds
        if (intersectionPoint.x < Math.min(line.start.x, line.end.x) || intersectionPoint.x > Math.max(line.start.x, line.end.x)) {
            return false;
        }
        
        // check if intersectionPoint is on Plane
        return this.normal.dot(intersectionPoint) === this.normal.dot(this.pos);
    }
}

test('plane intersection', () => {
    {
        const a = new Plane(new Pos(0, 0, 0), new Pos(0, 0, 1));
        const b = new Line(new Pos(0, 0, 0), new Pos(1, 1, 1));
        assert.ok(a.intersects(b));
    }
    {
        const a = new Plane(new Pos(0, 0, 0), new Pos(0, 0, 1));
        const b = new Line(new Pos(0, 0, 1), new Pos(1, 1, 2));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Plane(new Pos(0, 0, 0), new Pos(0, 0, 1));
        const b = new Line(new Pos(0, 0, 1), new Pos(1, 1, 0));
        assert.ok(!a.intersects(b));
    }
    {
        const a = new Plane(new Pos(0, 0, 0), new Pos(0, 0, 1));
        const b = new Line(new Pos(0, 0, 1), new Pos(1, 1, -1));
        assert.ok(!a.intersects(b));
    }
});


class Brick {
    // Each brick is made up of a single straight line of cubes
    constructor(start, end) {
        this.line = new Line(start, end);
    }

    static parse(line) {
        // 8,4,294~8,7,294
        const [start, end] = line.split('~').map(x => x.split(',').map(Number));
        return new Brick(new Pos(...start), new Pos(...end));
    }

    intersects(other) {
        return this.line.intersects(other.line);
    }
}




const groundZ = 0;
const bricks = input.split('\n').map(Brick.parse);
for (const brick of bricks) {
    // console.log(brick);
}


