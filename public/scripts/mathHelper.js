class MathHelper {
    static randomColor() {
        return '#' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }
    static step(x, lowerBound, upperBound = Number.POSITIVE_INFINITY) {
        if (x < lowerBound) {
            return lowerBound;
        }
        if (x > upperBound) {
            return upperBound;
        }
        return x;
    }
    static collideRect(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2
            && x1 + w1 > x2
            && y1 < y2 + h2
            && y1 + h1 > y2;
    }
    static bresenhamLine(x1, y1, x2, y2) {
        let output = new Array;
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const sx = (x1 < x2) ? 1 : -1;
        const sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;
        while (true) {
            output.push(new Vec2(x1, y1));
            if ((x1 === x2) && (y1 === y2))
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
        return output;
    }
    static binarySearch(ar, el, compare_fn) {
        let m = 0;
        let n = ar.length - 1;
        while (m <= n) {
            const k = (n + m) >> 1;
            const cmp = compare_fn(el, ar[k]);
            if (cmp > 0) {
                m = k + 1;
            }
            else if (cmp < 0) {
                n = k - 1;
            }
            else {
                return k;
            }
        }
        return -m - 1;
    }
    static booleanBinarySearch(length, compareFunction) {
        let low = 0;
        let high = length - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            const booleanValue = compareFunction(mid);
            if (booleanValue) {
                low = mid + 1;
            }
            else if (low == mid) {
                return mid;
            }
            else {
                high = mid;
            }
        }
        return -low;
    }
    static generateSquareMesh(x1, y1, x2, y2) {
        return [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ];
    }
}
class Vec2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    scale(sx, sy) {
        this.x *= sx;
        this.y *= sy;
    }
    getArray() {
        return new Float32Array([this.x, this.y]);
    }
    static get zero() {
        return new Vec2(0, 0);
    }
}
class Vec3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    translate(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    scale(sx, sy, sz) {
        this.x *= sx;
        this.y *= sy;
        this.z *= sz;
    }
    getArray() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    static get zero() {
        return new Vec3(0, 0, 0);
    }
}
class Rect {
    x;
    y;
    w;
    h;
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
    }
    scale(sx, sy) {
        this.x *= sx;
        this.y *= sy;
        this.w *= sx;
        this.h *= sy;
    }
    getArray() {
        return new Float32Array([this.x, this.y, this.w, this.h]);
    }
}
