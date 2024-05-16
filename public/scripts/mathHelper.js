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
    static binarySearch(array, element, compareFn) {
        let m = 0;
        let n = array.length - 1;
        while (m <= n) {
            const k = (n + m) >> 1;
            const cmp = compareFn(element, array[k]);
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
    static booleanBinarySearch(length, compareFn) {
        let low = 0;
        let high = length - 1;
        while (low <= high) {
            const mid = (low + high) >>> 1;
            if (compareFn(mid)) {
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
    static indexElementIntoSortedArray(arrayLength, compareFn) {
        let low = 0;
        let high = arrayLength;
        while (low < high) {
            const mid = (low + high) >>> 1;
            if (compareFn(mid)) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
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
