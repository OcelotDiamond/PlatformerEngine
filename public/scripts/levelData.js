class LevelData {
    tileData = [];
    tileSet = [];
    width = 0;
    height = 0;
    size = 0;
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
    set data(data) {
        this.tileData = data;
    }
    set tiles(tiles) {
        this.tileSet = tiles;
    }
    set x(width) {
        this.width = width;
    }
    set y(height) {
        this.height = height;
    }
    set tileSize(size) {
        this.size = size;
    }
    getTile(x, y) {
        return this.tileSet[this.getTileIndex(x, y)];
    }
    getTileIndex(x, y) {
        return this.tileData[this.width * y + x];
    }
    isInBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    convertInBounds(index) {
        return [index % this.width, Math.floor(index / this.width)];
    }
}
