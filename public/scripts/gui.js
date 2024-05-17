class Gui {
    elements = [];
    drawElements(game) {
        this.elements.forEach(e => e.draw());
    }
    update(game, deltaTime) { }
}
class LevelSelectGui extends Gui {
    update(game, deltaTime) {
        const x = 18;
        const y = 12;
        const tileSize = 64;
        const tiles = [new AirTile(game.renderer.gl), new BrickTile(game.renderer.gl), new DirtTile(game.renderer.gl)];
        const background = game.levelDataLevels[0];
        const midground = game.levelDataLevels[1];
        const foreground = game.levelDataLevels[2];
        background.width = x;
        background.height = y;
        midground.width = x;
        midground.height = y;
        foreground.width = x;
        foreground.height = y;
        background.tileSize = tileSize;
        midground.tileSize = tileSize;
        foreground.tileSize = tileSize;
        foreground.data = new Array(x * y);
        foreground.data.fill(0);
        midground.data = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 1,
            1, 0, 2, 2, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 1,
            1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1,
            1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        ];
        foreground.data = new Array(x * y);
        foreground.data.fill(0);
        background.tiles = tiles;
        midground.tiles = tiles;
        foreground.tiles = tiles;
        game.gui = null;
    }
}
class GuiElement {
    draw() { }
}
