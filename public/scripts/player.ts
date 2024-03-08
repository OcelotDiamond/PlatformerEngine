class Player extends Entity {
    w:number = 32;
    h:number = 48;

    friction:number = 2;
    movementSpeed:number = 5;
    jumpPower:number = 20;

    onGround:boolean = false;
    sneaking:boolean = false;

    maxCoyoteTime:number = 5;
    coyoteTime:number = 0;

    lastMovementDirection:boolean = false;

    gravityForce:number = 1;

    windForceX:number = 0;
    windForceY:number = 0;

    textures:Array<WebGLTexture> = [];

    constructor(game:Game) {
        super(game);

        this.init(game);
    }

    async init(game:Game) {
        const program = GLUtils.getShader(TexturedShader, game.renderer.gl);

        const mainImage = await PackageManager.asyncLoadImage('./assets/player/playerNormal.png');
        const crouchedImage = await PackageManager.asyncLoadImage('./assets/player/playerCrouched.png');

        this.textures.push(GLUtils.setupTexture(game.renderer.gl, mainImage));
        this.textures.push(GLUtils.setupTexture(game.renderer.gl, crouchedImage));
    }

    getMovementSpeed() {
        return this.movementSpeed;
    }

    getJumpHeight() {
        return this.jumpPower;
    }

    draw(gl:WebGL2RenderingContext, game:Game) {
        game.renderer.drawBasicTexture(gl, this.sneaking ? this.textures[1]: this.textures[0], this.x, this.y, this.w, this.h, this.lastMovementDirection);
    }

    update(game:Game, deltaTime:number) {
        let dx = this.dx;
        let dy = this.dy;

        if (Controls.isKeyDown('w') || Controls.isKeyDown(' ') || Controls.isKeyDown('arrowup')) {
            if (this.coyoteTime > 0) {
                dy = -this.jumpPower;
                this.coyoteTime = 0;
            }
        } else {
        }

        if ((Controls.isKeyDown('s') || Controls.isKeyDown('shift') || Controls.isKeyDown('arrowdown'))) {
            if (!this.sneaking) {
                this.h = 32;
                this.y += 16;
                this.jumpPower = 16;
                this.movementSpeed = 3;
                this.sneaking = true;
            }
        } else {
            if (this.sneaking && this.checkCollision(this.x, this.y - 16, this.w, 48, game.levelData)) {
                this.h = 48;
                this.y -= 16;
                this.jumpPower = 20;
                this.movementSpeed = 5;
                this.sneaking = false;
            }
        }

        if (Controls.isKeyDown('a') || Controls.isKeyDown('arrowleft')) {
            dx -= this.movementSpeed;
        } else {

        }

        if (Controls.isKeyDown('d') || Controls.isKeyDown('arrowright')) {
            dx += this.movementSpeed;
        } else {

        }

        if (Math.abs(dx) > 0) {
            if (dx < 0) {
                this.lastMovementDirection = true;
            } else {
                this.lastMovementDirection = false;
            }
        }

        dx = this.doXCollision(game, this.x, this.y, dx);
        this.x += dx;

        const preDY = dy;

        dy += this.gravityForce;

        dx += this.windForceX;
        dy += this.windForceY;

        dy = this.doYCollision(game, this.x, this.y, dy);
        this.y += dy;

        this.coyoteTime -= 1;
        if (preDY == dy) {
            this.onGround = true;
            this.coyoteTime = this.maxCoyoteTime;
        } else {
            this.onGround = false;
        }

        dx /= this.friction;

        this.dx = dx - MathHelper.step(Math.abs(dx), 0, 0.05) * Math.sign(dx);
        this.dy = dy - MathHelper.step(Math.abs(dy), 0, 0.05) * Math.sign(dy);
    }
}