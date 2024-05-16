class Game {
    renderer:Renderer;
    levelDataLevels:LevelData[] = [];
    entities:Entity[][] = [];
    gui:Gui;
    lastTimestamp:number;

    constructor(canvas:HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);
        this.levelDataLevels.push(new LevelData(), new LevelData(), new LevelData());
        Controls.init();
    }

    async init() {
        this.entities.push([], [new Player(this)], []);

        this.gui = new LevelSelectGui();

        requestAnimationFrame(this.renderTick.bind(this));
    }

    gameTick(deltaTime:number) {
        if (this.gui) {
            this.gui.update(this, deltaTime);
        } else if (this.levelDataLevels.length > 0) {
            for (let i = 0; i < this.entities.length; i++) {
                for (let j = 0; j < this.entities[i].length; j++) {
                    this.entities[i][j].update(this, deltaTime);
                }
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