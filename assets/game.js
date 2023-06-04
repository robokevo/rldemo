class Game {
    constructor(settings) {
      //let settings;// = newSettings;
      //if (!settings) {
      //  settings = {};
      //  settings.depth = 3;
      //  settings.currentDepth = 0;
      //  settings.levels = [];
      //  settings.width = 100;
      //  settings.height = 100;
      //}
      this._depth = settings.worldData.depth;
      this._levels = settings.worldData.levels;
      this._width = settings.worldData.width;
      this._height = settings.worldData.height;
      // todo: specific tiles for biomes
      this._tiles = settings.tileData;
      this._noTile = new Tile(this._tiles['none']);
      this._currentDepth = settings.worldData.currentDepth || 0;
      this._levels[this._currentDepth] = new Grid(this._width,this._height);
      // todo: for centering play area; will eventually center on player
      this._centerX = Math.round(this._width/2);
      this._centerY = Math.round(this._height/2);
  }

  // width and height pertain to the game world, not the UI
  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get depth() {
    return this._depth;
  }

  // for centering play area on target display area
  get centerX() {
    return this._centerX;
  }

  get centerY() {
    return this._centerY;
  }

  get cursor() {
    return {x: this.centerX, y: this.centerY};
  }

  get level() {
    return this._levels[this._currentDepth];
  }

  get noTile() {
    return this._noTile;
  }

  get view() {
    return this._view;
  }

  set centerX(newX) {
    this._centerX = newX;
  }

  set centerY(newY) {
    this._centerY = newY;
  }

  getTile(x, y, z) {
    let newZ = z ?? this._currentDepth;
    if (this.level.contains(x,y)) {
      return this.level.getValue(x, y);
    } else {
      return this.noTile;
    }
  }

  newTile(tileType) {
    //to-do: level/biome support for varied tiles
    const newTile = new Tile(this._tiles[tileType]);
    return newTile;
  }

  makeLevel(currentDepth) {
    let depth = currentDepth || 0;
    const generator = new ROT.Map.Cellular(this.width,this.height);
    generator.randomize(0.5);
    const iterations = 2;
    // every iteration smoothens map
    for (let i = 0; i < iterations; i++){
      generator.create();
    }
    const newLevel = new Grid(this.width, this.height);
    const wallTile = new Tile(this._tiles['wall']);
    const floorTile = new Tile(this._tiles['floor']);
    // iterate one last time to write to map
    generator.create(function(x,y,v){
      if (v === 0) {
        newLevel.setValue(x, y, wallTile);
        // can't find 'this' within func [arrow func??]
        //this._levels[depth].setValue(x,y, newTile('wall'));
      } else {
        //this._levels[depth].setValue(x,y, newTile('floor'));
        newLevel.setValue(x, y, floorTile);
      }
    });
    this._levels[depth] = newLevel;
  }

  makeWorld() {
    for (let i = 0; i < this.depth; i++) {
      this.makeLevel(i);
    }
  }

  move(dX, dY) {
    let newX = this.centerX + dX;
    let newY = this.centerY + dY;
    if (this.level.contains(newX,newY)) {
      this.centerX = newX;
      this.centerY = newY;
      console.log(true);
      return true;
    }
  }


// end of Game class definition
};