class Entity {
    x = 0;
    y = 0;
    w = 0;
    h = 0;
    dx = 0;
    dy = 0;
    isIntractable = false;
    isSolid = false;
    levelDataIndex;
    constructor(game) {
        this.init(game);
    }
    async init(game) { }
    update(game, deltaTime) { }
    draw(gl, game) { }
    onInteraction(player, game) { }
    doCollision(levelData, x, y, dx, dy) {
        const { min, abs } = Math;
        if (this.checkCollision(min(x, x + dx) - 1, min(y, y + dy) - 1, this.w + abs(dx) + 1, this.h + abs(dy) + 1, levelData)) {
            return [dx, dy];
        }
        if (!this.checkCollision(x, y, this.w, this.h, levelData)) {
            return [0, 0];
        }
        const testPoints = MathHelper.bresenhamLine(0, 0, dx, dy);
        let index = 0;
        for (; index < testPoints.length; index += 2) {
            if (!this.checkCollision(testPoints[index] + x, testPoints[index + 1] + y, this.w, this.h, levelData)) {
                break;
            }
        }
        if (index === testPoints.length) {
            return [dx, dy];
        }
        const residualDx = dx - testPoints[index - 2];
        const residualDy = dy - testPoints[index - 1];
        dx = testPoints[index - 2];
        dy = testPoints[index - 1];
        if (this.checkCollision(x + dx + Math.sign(residualDx), y + dy, this.w, this.h, levelData)) {
            for (let i = 1; i <= Math.abs(residualDx); i++) {
                if (!this.checkCollision(x + dx + Math.sign(residualDx) * i, y + dy, this.w, this.h, levelData)) {
                    return [dx + Math.sign(residualDx) * (i - 1), dy];
                }
            }
            return [dx + residualDx, dy];
        }
        else if (this.checkCollision(x + dx, y + dy + Math.sign(residualDy), this.w, this.h, levelData)) {
            for (let i = 1; i <= Math.abs(residualDy); i++) {
                if (!this.checkCollision(x + dx, y + dy + Math.sign(residualDy) * i, this.w, this.h, levelData)) {
                    return [dx, dy + Math.sign(residualDy) * (i - 1)];
                }
            }
            return [dx, dy + residualDy];
        }
        return [dx, dy];
    }
    doXCollision(levelData, x, y, dx) {
        dx = Math.round(dx);
        let iterations = Math.floor(dx / this.w);
        const endBehavior = this.checkCollision(x + dx, y, this.w, this.h, levelData);
        let passLocation = NaN;
        let failLocation = NaN;
        let failed = false;
        for (let i = 1; i <= iterations; i++) {
            const testX = Math.round(x + dx * i / (iterations + 1));
            if (!this.checkCollision(testX, y, this.w, this.h, levelData)) {
                failLocation = testX;
                failed = true;
                break;
            }
            passLocation = testX;
        }
        if (failed || !endBehavior) {
            if (isNaN(passLocation)) {
                passLocation = x;
            }
            if (!endBehavior && isNaN(failLocation)) {
                failLocation = x + dx;
            }
            if (passLocation == failLocation) {
                return dx;
            }
            let line = [];
            for (let i = 0; i <= Math.abs(failLocation - passLocation); i++) {
                line.push(passLocation + i * Math.sign(failLocation - passLocation));
            }
            const index = MathHelper.booleanBinarySearch(line.length, index => this.checkCollision(line[index], y, this.w, this.h, levelData)) - 1;
            dx = line[index] - x;
        }
        if (isNaN(dx)) {
            dx = 0;
        }
        return dx;
    }
    doYCollision(levelData, x, y, dy) {
        dy = Math.round(dy);
        let iterations = Math.floor(dy / this.h);
        const endBehavior = this.checkCollision(x, y + dy, this.w, this.h, levelData);
        let passLocation = NaN;
        let failLocation = NaN;
        let failed = false;
        for (let i = 1; i <= iterations; i++) {
            const testY = Math.round(y + dy * i / (iterations + 1));
            if (!this.checkCollision(x, testY, this.w, this.h, levelData)) {
                failLocation = testY;
                failed = true;
                break;
            }
            passLocation = testY;
        }
        if (failed || !endBehavior) {
            if (isNaN(passLocation)) {
                passLocation = y;
            }
            if (!endBehavior && isNaN(failLocation)) {
                failLocation = y + dy;
            }
            let line = [];
            for (let i = 0; i <= Math.abs(failLocation - passLocation); i++) {
                line.push(passLocation + i * Math.sign(failLocation - passLocation));
            }
            const index = MathHelper.booleanBinarySearch(line.length, index => this.checkCollision(x, line[index], this.w, this.h, levelData)) - 1;
            dy = line[index] - y;
        }
        if (isNaN(dy)) {
            dy = 0;
        }
        return dy;
    }
    cornerCorrectX(levelData, x, y, dx, maxSnapDistance) {
        let dyModifier = Number.POSITIVE_INFINITY;
        let didChange = false;
        if (dx !== 0) {
            for (let i = -maxSnapDistance; i <= maxSnapDistance; i++) {
                if (Math.abs(i) < dyModifier && this.checkCollision(x + Math.sign(dx), y + i, this.w, this.h, levelData)) {
                    didChange = true;
                    dyModifier = i;
                }
            }
        }
        else {
            dyModifier = 0;
        }
        if (!didChange) {
            dyModifier = 0;
        }
        return dyModifier;
    }
    cornerCorrectY(levelData, x, y, dy, maxSnapDistance) {
        let dxModifier = Number.POSITIVE_INFINITY;
        let didChange = false;
        if (dy !== 0) {
            for (let i = -maxSnapDistance; i <= maxSnapDistance; i++) {
                if (Math.abs(i) < dxModifier && this.checkCollision(x + i, y + Math.sign(dy), this.w, this.h, levelData)) {
                    didChange = true;
                    dxModifier = i;
                }
            }
        }
        else {
            dxModifier = 0;
        }
        if (!didChange) {
            dxModifier = 0;
        }
        return dxModifier;
    }
    checkCollision(x, y, w, h, levelData) {
        const size = levelData.tileSize;
        for (let ix = Math.floor(x / size); ix < Math.ceil((x + w) / size); ix++) {
            for (let iy = Math.floor(y / size); iy < Math.ceil((y + h) / size); iy++) {
                if (levelData.isInBounds(ix, iy) && levelData.getTile(ix, iy).isSolid) {
                    if (MathHelper.collideRect(x, y, w, h, ix * size, iy * size, size, size)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}
