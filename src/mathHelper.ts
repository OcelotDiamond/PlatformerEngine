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

    /**
     * @param compareFn return negative if a < b, return zero if a = b, and return positive if a > b
     */
    static binarySearch<T>(array:T[], element:T, compareFn:(a:T, b:T) => number) {
        let m = 0;
        let n = array.length - 1;
        while (m <= n) {
            const k = (n + m) >> 1;
            const cmp = compareFn(element, array[k]);
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

    /**
     * @returns index of the first instance of false in list;
     */
    static booleanBinarySearch(length:number, compareFn:(index:number) => boolean) {
        let low = 0;
        let high = length - 1;
    
        while (low <= high) {
            const mid = (low + high) >>> 1;
            if (compareFn(mid)) {
                low = mid + 1;
            } else if (low == mid) {
                return mid;
            } else {
                high = mid;
            }
        }
        return -low;
    }

    /**
     * @param compareFn Return true if the test index's value is lower than the desired value. Otherwise return false.
     */

    static indexElementIntoSortedArray(arrayLength:number, compareFn:(index:number) => boolean):number {
        let low = 0;
        let high = arrayLength;

        while (low < high) {
            const mid = (low + high) >>> 1;
            if (compareFn(mid)) {
                low = mid + 1
            } else {
                high = mid
            }
        }

        return low;
    }

    static generateSquareMesh(x1:number, y1:number, x2:number, y2:number):number[] {
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