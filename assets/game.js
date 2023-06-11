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
      settings.game = this;
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
      this._player = new Entity(settings);
      // scheduler
      // todo: speed scheduler, realtime engine
      this._scheduler = new ROT.Scheduler.Simple();

  }

  get player() {
    return this._player;
  }
  set player(newPlayer) {
    this._player = newPlayer;
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
    return this._player.x;
  }

  get centerY() {
    return this._player.y;
  }

  get centerZ() {
    return this._player.z;
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

  // todo: align() to recenter after scroll, also scrolling

  getTile(x, y, z) {
    let newZ = z ?? this._currentDepth;
    if (this._levels[newZ].contains(x,y)) {
      return this.level.getValue(x, y);
    } else {
      return this.noTile;
    }
  }

  setTile(x, y, z, value) {
    this._levels[z].setValue(x,y,value);
  }

  newTile(tileType) {
    //to-do: level/biome support for varied tiles
    const newTile = new Tile(this._tiles[tileType]);
    return newTile;
  }

  destroyTile(tile) {
    const newTile = new Tile(this._tiles[tile.destroyed]);
    newTile.x = tile.x;
    newTile.y = tile.y;
    newTile.z = tile.z;
    // todo: rend tile returns loot into newtile's loot function
    tile.rend();
    this.setTile(newTile.x,newTile.y,newTile.z,newTile);
  }

  makeLevel(currentDepth) {
    let depth = currentDepth || 0;
    const generator = new ROT.Map.Cellular(this.width,this.height);
    generator.randomize(0.6);
    const iterations = 2;
    // every iteration smoothens map
    for (let i = 0; i < iterations; i++){
      generator.create();
    }
    const newLevel = new Grid(this.width, this.height);
    // iterate one last time to write to map
    // have to call this locally to be accessed within generator
    let game = this;
    generator.create(function(x,y,v){
      let newTile;
      if (v === 1) {
        newTile = new Tile(game._tiles['floor']);
        newTile.x = x;
        newTile.y = y;
        newTile.z = currentDepth;
        newLevel.setValue(x,y,newTile);
      } else {
        newTile = new Tile(game._tiles['wall']);
        newTile.x = x;
        newTile.y = y;
        newTile.z = currentDepth;
        newLevel.setValue(x,y,newTile);
      }
      //console.log(newLevel);
      //  //const wallTile = new Tile(this._tiles['wall']);
      //  //const floorTile = new Tile(this._tiles['floor']);
      //  newLevel.setValue(x, y, wallTile);
      //  // can't find 'this' within func [arrow func??]
      //  //this._levels[depth].setValue(x,y, newTile('wall'));
      //} else {
      //  //this._levels[depth].setValue(x,y, newTile('floor'));
      //  newLevel.setValue(x, y, floorTile);
      //}
    });
    this._levels[depth] = newLevel;
  }

  makeWorld() {
    for (let i = 0; i < this.depth; i++) {
      this.makeLevel(i);
    }
  }

  move(entity, coord) {
    let newX = entity.x;
    let newY = entity.y;
    let newZ = entity.z;
    
    if (coord.x) {
      newX += coord.x;
    }
    if (coord.y) {
      newY += coord.y;
    }
    if (coord.z) {
      newZ += coord.z;
    }
    if (this._levels[newZ].contains(newX,newY)) {
      entity.x = newX;
      entity.y = newY;
      entity.z = newZ;
      return true;
    }
  }

  freeTile(entity,z) {
    let freeZ = z ?? this._currentDepth;
    let freeX, freeY;
    while (!this.getTile(freeX,freeY).passable) {
      freeX = Math.floor(ROT.RNG.getUniform()*this.level.width);
      freeY = Math.floor(ROT.RNG.getUniform()*this.level.height);
    }
    entity.x = freeX;
    entity.y = freeY;
    entity.z = freeZ;
  }

  sleep(ms) {
    const date = Date.now();
    let currentDate = null;
    //do {
    //  currentDate = Date.now();
    //}
  }

// end of Game class definition
};

class Entity extends Glyph {
  constructor(settings) {
    super(settings);
    let eSettings;
    this._game = settings.game;
    this._player = false;
    if (!this._game.player) {
      this._player = true;
      eSettings = settings.playerData;
    } else {
      eSettings = settings.entityData;
    }
    this._name = eSettings.name || 'new buddy';
    this._char = eSettings.char || '?';
    this._mobile = eSettings.mobile || false;
    this._speed = settings.speed || 0;
  }

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }

  get game() {
    return this._game;
  }

  get mobile() {
    //todo: check for statuses to return otherwise
    return this._mobile;
  }

  getSpeed() {
    // this method is required by ROT speed scheduler
    return this._speed;
  }

  setPos(coord) {
    this._pos.x = coord.x ?? this._pos.x;
    this._pos.y = coord.y ?? this._pos.y;
    this._pos.z = coord.z ?? this._pos.z;
  }

  tryPos(coord) {
    const game = this.game;
    const tile = game.getTile(
      this.x + coord.x,
      this.y + coord.y,
      this.z + coord.z);
    let result = false;
    if (tile.passable && this.mobile) { // tile.passable
      //todo: also test for this.mobile to allow for immobile actors
      game.move(this, coord);
      result = true;
    } else if (tile.destructible) {
      game.destroyTile(tile);
      result = true;
    }
    return result;
  }
}