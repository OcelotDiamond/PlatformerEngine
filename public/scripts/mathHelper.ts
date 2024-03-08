class MathHelper {
    static randomColor():string {
        return '#' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
                   + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
                   + Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }

    static step(x:number, lowerBound:number, upperBound:number = Number.POSITIVE_INFINITY):number {
        if (x < lowerBound) {
            return lowerBound
        }
        if (x > upperBound) {
            return upperBound
        }
        return x
    }

    static collideRect(x1:number, y1:number, w1:number, h1:number, x2:number, y2:number, w2:number, h2:number):boolean {
        return x1 < x2 + w2
            && x1 + w1 > x2
            && y1 < y2 + h2
            && y1 + h1 > y2;
    }

    static bresenhamLine(x1:number, y1:number, x2:number, y2:number):Vec2[] {
        let output = new Array<Vec2>;

        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        while(true) {
            output.push(new Vec2(x1, y1));

            if ((x1 === x2) && (y1 === y2)) break;
            const e2 = 2*err;
            if (e2 > -dy) { err -= dy; x1  += sx; }
            if (e2 < dx) { err += dx; y1  += sy; }
        }

        return output;
    }

    // Compare function => negative: a < b, zero: a = b, positive: a > b
    static binarySearch<T>(ar:T[], el:T, compare_fn:(a:T, b:T) => number) {
        let m = 0;
        let n = ar.length - 1;
        while (m <= n) {
            const k = (n + m) >> 1;
            const cmp = compare_fn(el, ar[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if(cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return -m - 1;
    }

    // Finds first instance of false
    static booleanBinarySearch(length:number, compareFunction:(index:number) => boolean) {
        let low = 0;
        let high = length - 1;
    
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const booleanValue = compareFunction(mid);
            if (booleanValue) {
                low = mid + 1;
            } else if (low == mid) {
                return mid;
            } else {
                high = mid;
            }
        }
        return -low;
    }

    static generateSquareMesh(x1:number, y1:number, x2:number, y2:number):Array<number> {
        return [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]
    }
}

class Vec2 {
    x:number;
    y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    translate(x:number, y:number) {
        this.x += x;
        this.y += y;
    }

    scale(sx:number, sy:number) {
        this.x *= sx;
        this.y *= sy;
    }

    getArray() {
        return new Float32Array([this.x, this.y]);
    }

    static get zero():Vec2 {
        return new Vec2(0, 0);
    }
}

class Vec3 {
    x:number;
    y:number;
    z:number;

    constructor(x:number, y:number, z:number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    translate(x:number, y:number, z:number) {
        this.x += x;
        this.y += y;
        this.z += z;
    }

    scale(sx:number, sy:number, sz:number) {
        this.x *= sx;
        this.y *= sy;
        this.z *= sz;
    }

    getArray() {
        return new Float32Array([this.x, this.y, this.z]);
    }

    static get zero():Vec3 {
        return new Vec3(0, 0, 0);
    }
}

class Rect {
    x:number;
    y:number;
    w:number;
    h:number;

    constructor(x:number, y:number, w:number, h:number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    translate(x:number, y:number) {
        this.x += x;
        this.y += y;
    }

    scale(sx:number, sy:number) {
        this.x *= sx;
        this.y *= sy;
        this.w *= sx;
        this.h *= sy;
    }

    getArray() {
        return new Float32Array([this.x, this.y, this.w, this.h]);
    }
}