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
    this._settings = settings;
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
    this._player = new Player(settings, settings.playerData);
    // scheduler
    // todo: speed scheduler, realtime engine
    this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);
    // entities will be kept in list and be loaded/unloaded per floor;
    this._entities = [];
    for (let i = 0; i < this._depth; i++) {
      this._entities[i] = [];
    }
  }

  get settings() {
    return this._settings;
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

  get entities() {
    return this._entities[this._currentDepth];
  }

  set centerX(newX) {
    this._centerX = newX;
  }

  set centerY(newY) {
    this._centerY = newY;
  }

  get engine() {
    return this._engine;
  }

  // todo: align() to recenter after scroll, also scrolling

  getTile(coord) {
    const newZ = coord.z ?? this._currentDepth;
    const [x, y] = [coord.x,coord.y];
    if (this._levels[newZ].contains(x,y)) {
      return this.level.getValue(x, y);
    } else {
      return this.noTile;
    }
  }

  setTile(coord, value) {
    const [x,y,z] = [coord.x,coord.y,coord.z]; 
    this._levels[z].setValue(x,y,value);
  }

  newTile(tileType) {
    //todo: level/biome support for varied tiles
    const newTile = new Tile(this._tiles[tileType]);
    return newTile;
  }

  destroyTile(tile) {
    // todo: different destroyed tile 
    const newTile = new Tile(this._tiles[tile.destroyed]);
    newTile.x = tile.x;
    newTile.y = tile.y;
    newTile.z = tile.z;
    // todo: rend tile returns loot into newtile's loot function
    tile.rend();
    this.setTile(tile,newTile);
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

    });
    this._levels[depth] = newLevel;
  }

  populateLevels() {
    let allSettings = this.settings;
    let entitySettings = allSettings.entityData;
    let levelSettings;
    for (let i = 0; i < this.depth; i++){
      levelSettings = entitySettings.levelData[i];
      if (levelSettings) {
        let entities = Object.keys(levelSettings);
        for (let j = 0; j < entities.length; j++) {
          let entity = entities[j];
          let entDetails = levelSettings[entity];
          let instance;
          for (let k = 0; k < entDetails.qty; k++) {
            instance = new Entity(this.settings, entitySettings.bestiary[entity]);
            this.addEntity(instance, i);
          }
        }
      }
    }
  }

  makeWorld() {
    for (let i = 0; i < this.depth; i++) {
      this.makeLevel(i);
    }
    this.populateLevels();
  }

  move(entity, coord) {
    if (this._levels[coord.z].contains(coord.x,coord.y)) {
      entity.x = coord.x;
      entity.y = coord.y;
      entity.z = coord.z;
      return true;
    }
  }

  freeTile(z) {
    let freeZ = z ?? this._currentDepth;
    let coord = {x:-1,y:-1,z:freeZ};
    let freeTile;
    while (!this.getTile(coord).passable) {
      coord.x = Math.floor(ROT.RNG.getUniform()*this.level.width);
      coord.y = Math.floor(ROT.RNG.getUniform()*this.level.height);
      freeTile = this.getTile(coord);
    }
    return freeTile;
  }

  addEntity(entity,z) {
    //todo: check for entity as well as free tile
    let freeZ = z ?? this._currentDepth;
    const freeXYZ = this.freeTile(freeZ);
    entity.x = freeXYZ.x;
    entity.y = freeXYZ.y;
    entity.z = freeXYZ.z;
    this._entities[freeZ].push(entity);
  }

  isTileFree(coord) {
    const coordCheck = this.getEntity(coord);
    // todo: if entities are gaseous etc. implement passable
    if (!coordCheck && this.getTile(coord).passable) {
        return true;
    }
    return false;
  }

  getEntity(coord) {
    const z = coord.z ?? this._currentDepth;
    const [x, y] = [coord.x, coord.y];
    //todo: does entities need to get moved to a grid or map object?
    const entList = this.entities
    let result = false;
    let ent;
    for (let i = 0; i < entList.length; i++) {
      ent = entList[i];
      if (
        ent.x === x &&
        ent.y === y &&
        ent.z === z) {
        result = ent;
        break;
      }

    }
    return result;
  }

  loadScheduler(depth) {
    // loads ROT scheduler with list of entities; entities need .act() to
    //  lock and unlock engine plus getSpeed() for speed scheduler

    // entities will need to get unloaded and reloaded between floors
    // todo: experiment with floor difference affecting speed/keeping other
    //  floors active. may need dumbed down actions if so or perf will tank
    //  or only special monsters can avoid getting removed from scheduler
    const targetDepth = depth ?? this._currentDepth;
    const scheduler = this._scheduler;
    const ents = this._entities[targetDepth];
    for (let i = 0; i < ents.length; i++) {
      scheduler.add(ents[i], true);
    }
  }

  unloadScheduler(entityList) {
    scheduler.clear();
  }
// end of Game class definition
};


class Entity extends Glyph {
  constructor(settings, subsettings) {
    super(settings);
    this._game = settings.game;
    this._player = false;
    // todo: separate player class to avoid this hackiness
    this._name = subsettings.name || 'new buddy';
    this._char = subsettings.char || '?';
    this._mobile = subsettings.mobile || false;
    this._speed = subsettings.speed || 0;
    this._target = subsettings.target || false;
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
  
  get target() {
    return this._target;
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

  act() {
    // for catching game loop
    // todo: add delay to show individual movement/action
    //  until rts
    // todo: add range limit to avoid distant characters eating processor
    let game = this.game;
    game.engine.lock();
    console.log(this.name+'('+this.x+','+this.y+')');
    game.engine.unlock();
  }

  tryPos(coord) {
    const game = this.game;
    //let result = false;
    //let tile = game.getEntity(
    //  this.x + coord.x,
    //  this.y + coord.y,
    //  this.z + coord.z);
    //if (!tile) {
    //  tile = game.getTile(
    //    this.x + coord.x,
    //    this.y + coord.y,
    //    this.z + coord.z);
    //}
    //if (tile.passable && this.mobile) { // tile.passable
    //  //todo: also test for this.mobile to allow for immobilized actors
    //  game.move(this, coord);
    //  result = true;
    coord.x = coord.x + this.x;
    coord.y = coord.y + this.y;
    coord.z = coord.z + this.z;
    let result = game.isTileFree(coord);
    if (result && this.mobile) {
      game.move(this,coord);
      result = true;
      return result;
    }
    const ent = game.getEntity(coord);
    let tile;
    if (!ent) {
      tile = game.getTile(coord);
      if (tile.destructible) {
        game.destroyTile(tile);
        result = true;
        return result;
      }
    }
    if (ent.target) {
      console.log(ent);
      return true;
    }
    //if (!result) {
    //  entity = game.getEntity(coord);
    //  console.log(entity);
    //  return result;   
    //}
    //const tile  = game.getTile()
    //if (tile.destructible) {
    //  // todo: change to attack
    //  game.destroyTile(tile);
    //  result = true;
    //}
    //return result;
    console.log('tryPos error');
  }
}

class Player extends Entity {
  constructor(settings, subsettings) {
    super(settings, subsettings);
    this._player = true;
  }

  act() {
    this.game.engine.lock();
  }
}