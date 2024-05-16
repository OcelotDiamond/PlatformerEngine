class Tile {
    isSolid;
    constructor(gl) { }
    drawTiles(gl, game, tileIndex, tileLevel) { }
}
class TexturedTile extends Tile {
    texture;
    glTexture;
    uvDivisions = 1;
    uvOffset = 0;
    constructor(gl, source) {
        super(gl);
        this.init(gl, source);
    }
    async init(gl, source) {
        const program = GLUtils.getShader(TexturedShader, gl);
        this.texture = await PackageManager.asyncLoadImage(source);
        this.glTexture = GLUtils.setupTexture(gl, this.texture);
    }
    getTexCoords(x, y, levelData, tileIndex) {
        const a = this.uvOffset / this.uvDivisions;
        const b = (this.uvOffset + 1) / this.uvDivisions;
        return [
            a, 0,
            b, 0,
            a, 1,
            a, 1,
            b, 0,
            b, 1,
        ];
    }
    getPolygons(x, y, levelData, tileIndex) {
        const x1 = x * levelData.tileSize;
        const y1 = y * levelData.tileSize;
        const x2 = x1 + levelData.tileSize;
        const y2 = y1 + levelData.tileSize;
        return MathHelper.generateSquareMesh(x1, y1, x2, y2);
    }
    getCount(x, y, levelData, tileIndex) {
        return 6;
    }
    getGeometry(levelData, tileIndex) {
        const posArray = [];
        const texCoordArray = [];
        let count = 0;
        for (let i = 0; i < levelData.tileData.length; i++) {
            if (levelData.tileData[i] === tileIndex) {
                const [x, y] = levelData.convertInBounds(i);
                posArray.push(...this.getPolygons(x, y, levelData, tileIndex));
                texCoordArray.push(...this.getTexCoords(x, y, levelData, tileIndex));
                count += this.getCount(x, y, levelData, tileIndex);
            }
        }
        return [new Float32Array(posArray), new Float32Array(texCoordArray), count];
    }
    drawTiles(gl, game, tileIndex, tileLevel) {
        const [geometry, texCoords, count] = this.getGeometry(game.levelDataLevels[tileLevel], tileIndex);
        game.renderer.drawTextures(gl, this.glTexture, geometry, texCoords, count);
    }
}
class CTXTile extends TexturedTile {
}
class AirTile extends Tile {
    isSolid = false;
}
class DirtTile extends TexturedTile {
    isSolid = true;
    constructor(gl) {
        super(gl, './assets/tiles/dirtTile.png');
    }
}
class BrickTile extends TexturedTile {
    isSolid = true;
    constructor(gl) {
        super(gl, './assets/tiles/brickTile.png');
    }
}
