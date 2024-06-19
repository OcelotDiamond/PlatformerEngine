class Camera {
    generateCameraDimensions(x:number, y:number, xPreferred:number[], yPreferred:number[]):ScreenDimensions {
        if (x <= 0 || y <= 0 || Math.max(...xPreferred) <= 0 || Math.max(...yPreferred) <= 0) {
            console.warn('Screen size should not be zero');
            return ScreenDimensions.default;
        }

        if (xPreferred.length === 0 || yPreferred.length === 0 || xPreferred.length !== yPreferred.length) {
            console.warn('Invalid x/y preferred counts');
            return ScreenDimensions.default;
        }

        for (let i = 0; i < xPreferred.length; i++) {
            if (xPreferred[i] % x === 0 && yPreferred[i] % y === 0 && x / y === xPreferred[i] / yPreferred[i]) {
                return new ScreenDimensions(xPreferred[i], yPreferred[i], x / xPreferred[i]);
            }
        }

        let closestIndex = 0;

        for (let i = 0; i < xPreferred.length; i++) {
            if (Math.abs(xPreferred[i] / yPreferred[i] - x / y) < Math.abs(xPreferred[closestIndex] / yPreferred[closestIndex] - x / y)) {
                closestIndex = i;
            }
        }

        const screenMultiplier = Math.floor(Math.max(x / xPreferred[closestIndex], y / yPreferred[closestIndex]));
        const XGreaterThanY = x / xPreferred[closestIndex] > y / yPreferred[closestIndex];
        const screenSize = XGreaterThanY ? x : y;
        const nativeScreenSize = XGreaterThanY ? xPreferred[closestIndex] : yPreferred[closestIndex];
        const maxSteps = Math.ceil(nativeScreenSize / (2 * screenMultiplier + 1)) + 1;

        for (let step = 0; step <= maxSteps; step++) {
            // Lower setting check
            if ((nativeScreenSize + step) * screenMultiplier > screenSize) {
                return XGreaterThanY ?
                    new ScreenDimensions(nativeScreenSize + step, Math.ceil((nativeScreenSize + step) * y/x), screenMultiplier):
                    new ScreenDimensions(Math.ceil((nativeScreenSize + step) * x/y), nativeScreenSize + step, screenMultiplier);
            }

            // Higher setting check
            if ((nativeScreenSize - step) * (screenMultiplier + 1) < screenSize) {
                return XGreaterThanY ?
                    new ScreenDimensions(nativeScreenSize - step + 1, Math.ceil((nativeScreenSize - step + 1) * y/x), screenMultiplier + 1):
                    new ScreenDimensions(Math.ceil((nativeScreenSize - step + 1) * x/y), nativeScreenSize - step + 1, screenMultiplier + 1);
            }
        }
    }
}

class ScreenDimensions {
    x: number;
    y: number;
    multiplier: number;

    constructor(x:number, y:number, multiplier:number) {
        this.x = x;
        this.y = y;
        this.multiplier = Math.round(multiplier);
    }

    static get default():ScreenDimensions {
        return new ScreenDimensions(0, 0, 1);
    }
}