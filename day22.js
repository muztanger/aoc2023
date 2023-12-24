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
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    // intersects(other) {
    //     // https://stackoverflow.com/a/1968345/115589
    //     const p = this.start;
    //     const q = other.start;
    //     const r = this.end.sub(this.start); // end = start + r
    //     const s = other.end.sub(other.start);

    //     const rxs = r.cross(s);
    //     const qpxr = q.sub(p).cross(r);

    //     if (rxs.equals(Pos.ZERO) && qpxr.equals(Pos.ZERO)) {
    //         // collinear
    //         return true;
    //     } else if (rxs.equals(Pos.ZERO) && !qpxr.equals(Pos.ZERO)) {
    //         // parallel
    //         return false;
    //     }
        
    //     if (!qpxr.equals(Pos.ZERO)) { 
    //         const t = (q.sub(p).cross(s)) / rxs;
    //         const u = qpxr / rxs;
    //         if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
    //             // intersection
    //             return true;
    //         }
    //     }
    //     // no intersection
    //     return false;
    // }

    intersects(other) {
        let v1 = this.end.sub(this.start);
        let v2 = other.end.sub(other.start);
        let v3 = other.start.sub(this.start);
      
        let v1CrossV2 = v1.cross(v2);
        let v1CrossV3 = v1.cross(v3);

        let dotProduct = v1CrossV2.dot(v1CrossV3);
      
        if (dotProduct < 0) {
          return false;
        }
      
        let v2CrossV3 = new THREE.Vector3().crossVectors(v2, v3);
        dotProduct = v1CrossV2.dot(v2CrossV3);
      
        if (dotProduct < 0) {
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

test('line intersection', () => {
    const a = new Line(new Pos(0, 0, 0), new Pos(10, 0, 0));
    const b = new Line(new Pos(5, 5, 0), new Pos(5, 0, 0));
    assert.equal(a.intersects(b), true);
    assert.equal(b.intersects(a), true);
});

class Brick {
    // Each brick is made up of a single straight line of cubes
    constructor(start, end) {
        this.start = start;
        this.end = end;
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
for (let line of input.split('\n')) {
    //console.log(line, Brick.parse(line));
}


