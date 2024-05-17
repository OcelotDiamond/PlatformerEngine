class Player extends Entity {
    w = 32;
    h = 48;
    friction = 2;
    movementSpeed = 5;
    jumpPower = 18;
    onGround = false;
    sneaking = false;
    maxCoyoteTime = 5;
    coyoteTime = 0;
    lastMovementDirection = false;
    gravityForce = 1;
    windForceX = 0;
    windForceY = 0;
    levelDataIndex = 1;
    textures = [];
    constructor(game) {
        super(game);
        this.init(game);
    }
    async init(game) {
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
    draw(gl, game) {
        game.renderer.drawBasicTexture(gl, this.sneaking ? this.textures[1] : this.textures[0], Math.round(this.x / 3) * 3, Math.round(this.y / 3) * 3, this.w, this.h, this.lastMovementDirection);
    }
    update(game, deltaTime) {
        let dx = this.dx;
        let dy = this.dy;
        if (Controls.isKeyDown('w') || Controls.isKeyDown(' ') || Controls.isKeyDown('arrowup')) {
            if (this.coyoteTime > 0) {
                dy = -this.jumpPower;
                this.coyoteTime = 0;
            }
        }
        else {
        }
        if ((Controls.isKeyDown('s') || Controls.isKeyDown('shift') || Controls.isKeyDown('arrowdown'))) {
            if (!this.sneaking) {
                this.h = 32;
                this.y += 16;
                this.jumpPower = 16;
                this.movementSpeed = 3;
                this.sneaking = true;
            }
        }
        else {
            if (this.sneaking && this.checkCollision(this.x, this.y - 16, this.w, 48, game.levelDataLevels[this.levelDataIndex])) {
                this.h = 48;
                this.y -= 16;
                this.jumpPower = 20;
                this.movementSpeed = 5;
                this.sneaking = false;
            }
        }
        if (Controls.isKeyDown('a') || Controls.isKeyDown('arrowleft')) {
            dx -= this.movementSpeed;
        }
        else {
        }
        if (Controls.isKeyDown('d') || Controls.isKeyDown('arrowright')) {
            dx += this.movementSpeed;
        }
        else {
        }
        if (Math.abs(dx) > 0) {
            if (dx < 0) {
                this.lastMovementDirection = true;
            }
            else {
                this.lastMovementDirection = false;
            }
        }
        const preDy = dy;
        [dx, dy] = this.doCollision(game.levelDataLevels[this.levelDataIndex], this.x, this.y, Math.round(dx), Math.round(dy));
        this.x += dx;
        this.y += dy;
        dy += this.gravityForce;
        dx += this.windForceX;
        dy += this.windForceY;
        this.coyoteTime -= 1;
        if (Math.round(preDy) === dy) {
            this.onGround = true;
            this.coyoteTime = this.maxCoyoteTime;
        }
        else {
            this.onGround = false;
        }
        dx /= this.friction;
        this.dx = dx - MathHelper.step(Math.abs(dx), 0, 0.05) * Math.sign(dx);
        this.dy = dy - MathHelper.step(Math.abs(dy), 0, 0.05) * Math.sign(dy);
    }
}
