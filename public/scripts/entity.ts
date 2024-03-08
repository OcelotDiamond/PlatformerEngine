class Entity {
    x:number = 0;
    y:number = 0;
    w:number = 0;
    h:number = 0;

    dx:number = 0;
    dy:number = 0;

    isIntractable:boolean = false;
    isSolid:boolean = false;

    constructor(game:Game) {
        this.init(game);
    }

    async init(game:Game) {}

    update(game:Game, deltaTime:number) {}

    draw(gl:WebGL2RenderingContext, game:Game) {}

    onInteraction(player:Player, game:Game) {}

    // Scuffed collision code

    doXCollision(game:Game, x:number, y:number, dx:number):number {
        dx = Math.round(dx);

        let iterations = Math.floor(dx / this.w);

        const endBehavior = this.checkCollision(x + dx, y, this.w, this.h, game.levelData);

        let passLocation = NaN
        let failLocation = NaN;
        let failed = false;

        for (let i = 1; i <= iterations; i++) {
            const testX = Math.round(x + dx * i / (iterations + 1));

            if (!this.checkCollision(testX, y, this.w, this.h, game.levelData)) {
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
                failLocation = x+dx;
            }

            if (passLocation == failLocation) {
                return dx
            }

            let line:Array<number> = [];
            for (let i = 0; i <= Math.abs(failLocation - passLocation); i ++) {
                line.push(passLocation + i * Math.sign(failLocation - passLocation));
            }

            const index = MathHelper.booleanBinarySearch(line.length,
                index => this.checkCollision(line[index], y, this.w, this.h, game.levelData)) - 1;

            dx = line[index] - x;
        }

        if (isNaN(dx)) {
            dx = 0;
        }

        return dx;
    }

    doYCollision(game:Game, x:number, y:number, dy:number):number {
        dy = Math.round(dy);

        let iterations = Math.floor(dy / this.h);

        const endBehavior = this.checkCollision(x, y + dy, this.w, this.h, game.levelData);

        let passLocation = NaN
        let failLocation = NaN;
        let failed = false;

        for (let i = 1; i <= iterations; i++) {
            const testY = Math.round(y + dy * i / (iterations + 1));

            if (!this.checkCollision(x, testY, this.w, this.h, game.levelData)) {
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

            let line:Array<number> = [];
            for (let i = 0; i <= Math.abs(failLocation - passLocation); i ++) {
                line.push(passLocation + i * Math.sign(failLocation - passLocation));
            }

            const index = MathHelper.booleanBinarySearch(line.length,
                index => this.checkCollision(x, line[index], this.w, this.h, game.levelData)) - 1;

            dy = line[index] - y;
        }

        if (isNaN(dy)) {
            dy = 0;
        }

        return dy;
    }

    checkCollision(x:number, y:number, w:number, h:number, levelData:LevelData):boolean {
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