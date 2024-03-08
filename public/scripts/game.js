class Game {
    renderer;
    levelData;
    entities = [];
    gui;
    lastTimestamp;
    constructor(canvas) {
        this.renderer = new Renderer(canvas);
        this.levelData = new LevelData();
        Controls.init();
    }
    async init() {
        this.entities.push(new Player(this));
        this.gui = new LevelSelectGui();
        requestAnimationFrame(this.renderTick.bind(this));
    }
    gameTick(deltaTime) {
        if (this.gui) {
            this.gui.update(this, deltaTime);
        }
        else if (this.levelData) {
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].update(this, deltaTime);
            }
        }
    }
    renderTick(time) {
        requestAnimationFrame(this.renderTick.bind(this));
        if (this.lastTimestamp !== time) {
            const deltaTime = time - this.lastTimestamp;
            this.lastTimestamp = time;
            this.gameTick(deltaTime);
            this.renderer.draw(this);
        }
    }
}
