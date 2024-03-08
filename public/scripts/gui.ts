abstract class Gui {
    elements:Array<GuiElement> = [];

    drawElements(game:Game) {
        this.elements.forEach(e => e.draw());
    }

    update(game:Game, deltaTime:number) {}
}

class LevelSelectGui extends Gui {
    update(game: Game, deltaTime: number): void {
        const levelDat = game.levelData;
        levelDat.x = 18;
        levelDat.y = 12;

        levelDat.tileSize = 56

        levelDat.data = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,1,
            1,0,2,2,2,2,2,0,1,0,0,0,0,0,2,2,0,1,
            1,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,0,1,1,1,0,0,0,0,0,0,1,1,
            1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,
            1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,
            1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        levelDat.tiles = [new AirTile(game.renderer.gl), new BrickTile(game.renderer.gl), new DirtTile(game.renderer.gl)];

        game.gui = null;
    }
}

abstract class GuiElement {
    draw() {}
}