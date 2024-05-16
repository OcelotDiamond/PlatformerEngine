class LevelData {
    tileData:number[] = [];

    tileSet:Tile[] = [];

    width:number = 0;
    height:number = 0;

    size:number = 0;

    get data() {
        return this.tileData;
    }

    get tiles() {
        return this.tileSet;
    }

    get x() {
        return this.width;
    }

    get y() {
        return this.height;
    }

    get tileSize() {
        return this.size;
    }

    set data(data:number[]) {
        this.tileData = data;
    }

    set tiles(tiles:Tile[]) {
        this.tileSet = tiles;
    }

    set x(width:number) {
        this.width = width;
    }

    set y(height:number) {
        this.height = height;
    }

    set tileSize(size:number) {
        this.size = size
    }

    getTile(x:number, y:number) {
        return this.tileSet[this.getTileIndex(x, y)];
    }

    getTileIndex(x:number, y:number) {
        return this.tileData[this.width * y + x];
    }

    isInBounds(x:number, y:number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    convertInBounds(index:number):number[] {
        return [index % this.width, Math.floor(index / this.width)];
    }
}