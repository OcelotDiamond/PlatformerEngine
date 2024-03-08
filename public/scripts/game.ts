class Game {
    renderer:Renderer;
    levelData:LevelData;
    entities:Array<Entity> = [];
    gui:Gui;
    lastTimestamp:number;

    constructor(canvas:HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.levelData = new LevelData();
        Controls.init();
    }

    async init() {
        this.entities.push(new Player(this));

        this.gui = new LevelSelectGui();

        requestAnimationFrame(this.renderTick.bind(this));
    }

    gameTick(deltaTime:number) {
        if (this.gui) {
            this.gui.update(this, deltaTime);
        } else if (this.levelData) {
            for (let i = 0; i < this.entities.length; i++) {
                this.entities[i].update(this, deltaTime);
            }
        }
    }

    renderTick(time:number) {
        requestAnimationFrame(this.renderTick.bind(this));

        if (this.lastTimestamp !== time) {
            const deltaTime = time - this.lastTimestamp;
            this.lastTimestamp = time;

            this.gameTick(deltaTime);

            this.renderer.draw(this);
        }
    }
}