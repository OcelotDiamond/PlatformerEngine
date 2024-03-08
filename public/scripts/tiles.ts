abstract class Tile {
    isSolid:boolean;

    constructor(gl:WebGL2RenderingContext) {}

    drawTiles(gl:WebGL2RenderingContext, game:Game, tileIndex:number) {}
}

abstract class TexturedTile extends Tile {
    texture:HTMLImageElement;
    glTexture:WebGLTexture;
    uvDivisions:number = 1;
    uvOffset:number = 0;

    constructor(gl:WebGL2RenderingContext, source:string) {
        super(gl);

        this.init(gl, source);
    }

    async init(gl:WebGL2RenderingContext, source:string) {
        const program = GLUtils.getShader(TexturedShader, gl);

        this.texture = await PackageManager.asyncLoadImage(source);

        this.glTexture = GLUtils.setupTexture(gl, this.texture);
    }

    getTexCoords(x:number, y:number, levelData:LevelData, tileIndex:number):Array<number> {
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

    getPolygons(x:number, y:number, levelData:LevelData, tileIndex:number) {
        const x1 = x * levelData.tileSize;
        const y1 = y * levelData.tileSize;

        const x2 = x1 + levelData.tileSize;
        const y2 = y1 + levelData.tileSize;

        return [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ];
    }

    getCount(x:number, y:number, levelData:LevelData, tileIndex:number) {
        return 6;
    }

    getGeometry(levelData:LevelData, tileIndex:number):[Float32Array, Float32Array, number] {
        const posArray:Array<number> = [];
        const texCoordArray:Array<number> = [];
        let count = 0;

        for (let i = 0; i < levelData.tileData.length; i++) {
            if (levelData.tileData[i] === tileIndex) {
                const [x, y] = levelData.convertInBounds(i);

                const x1 = x * levelData.tileSize;
                const y1 = y * levelData.tileSize;

                const x2 = x1 + levelData.tileSize;
                const y2 = y1 + levelData.tileSize;

                posArray.push(...this.getPolygons(x, y, levelData, tileIndex));

                texCoordArray.push(...this.getTexCoords(x, y, levelData, tileIndex));

                count += this.getCount(x, y, levelData, tileIndex);
            }
        }

        return [new Float32Array(posArray), new Float32Array(texCoordArray), count];
    }

    drawTiles(gl: WebGL2RenderingContext, game: Game, tileIndex:number) {
        const [geometry, texCoords, count] = this.getGeometry(game.levelData, tileIndex);

        game.renderer.drawTextures(gl, this.glTexture, geometry, texCoords, count);
    }
}

class CTXTile extends TexturedTile {
    
}

class AirTile extends Tile {
    isSolid:boolean = false;
}

class DirtTile extends TexturedTile {
    isSolid:boolean = true;

    constructor(gl:WebGL2RenderingContext) {
        super(gl, './assets/tiles/dirtTile.png');
    }
}

class BrickTile extends TexturedTile {
    isSolid:boolean = true;

    constructor(gl:WebGL2RenderingContext) {
        super(gl, './assets/tiles/brickTile.png');
    }
}