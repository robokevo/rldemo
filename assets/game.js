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

  get scheduler() {
    return this._scheduler;
  }

  // todo: align() to recenter after scroll, also scrolling
  getRandom() {
    // pseudorandom generator that works from seed number
    // comparable to Math.random()
    return ROT.RNG.getUniform();
  }

  getRandomInt(lower, upper) {
    // pseudorandom generator that works from seed number
    // for int in range of lower to upper (inclusive)
    return ROT.RNG.getUniformInt(lower, upper);
  }

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
    generator.randomize(0.5);
    const iterations = 1;
    // every iteration smoothens map
    for (let i = 0; i < iterations; i++){
      generator.create();
    }
    const newLevel = new Grid(this.width, this.height);
    // iterate one last time to write to map
    // have to call this locally to be accessed within generator
    let game = this;
    generator.connect();
    generator.create(function(x,y,v){
      let newTile;
      if (v === 0) {
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

  freeTile(startXY, endXY) {
    // if start/end supplied, finds a random free tile in range, otherwise
    // finds a random free tile throughout the entire map, minus a small
    // buffer to keep spawns from edges
    let buffer, xOffset, yOffset, width, height, freeTile;
    if (startXY && endXY) {
      buffer = 0;
      xOffset = startXY.x;
      yOffset = startXY.y;
      width = endXY.x - startXY.x;
      height = endXY.y - startXY.y;
    } else {
      buffer = 5;
      xOffset = 0;
      yOffset = 0;
      width = this.level.width;
      height = this.level.height;
    }
    // start with invalid coord to start search; valid depth needed or error
    let coord = {x:-1,y:-1,z:this._currentDepth};
    if ((xOffset === 0) && (yOffset === 0) &&
      (width === this.level.width) && (height === this.level.height)) {
      // warning: can hang if no valid target found
      // this method only used when placing through whole map
      while (!this.isTileFree(coord)) {
        coord.x = Math.floor(this.getRandom() * width);
        if ((coord.x > (width - buffer)) || (coord.x <= buffer)) {
          coord.x = -1;
        }
        coord.y = Math.floor(this.getRandom() * height);
        if ((coord.y > (height - buffer)) || (coord.y <= buffer)) {
          coord.y = -1;
        }
        freeTile = this.getTile(coord);
      }
      return freeTile;
    } else {
      const freeTiles = [];
      let coord, choice;
      for (let i = xOffset; i <= xOffset + width; i++) {
        for (let j = yOffset; j <= yOffset + height; j++) {
          coord = {x: i, y: j};
          let free = this.isTileFree(coord)
          if (free){
            freeTiles.push(coord);
          }
        }
      }
      if (freeTiles.length > 0) {
        choice = this.getRandomInt(0, freeTiles.length - 1);
        console.log(this.getTile(freeTiles[choice]));
      } else {
        return false;
      }
    }

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

  removeEntity(entity) {
    let entities = this.entities;
    let ent;
    for (let i = 0; i < entities.length; i++) {
      ent = entities[i];
      if (ent===entity) {
        if (entity.actor) {
          this.scheduler.remove(entity);
        }
        entity.expire();
        entities.splice(i,1);
        break
      }
    }
  }

  loadScheduler(depth) {
    // loads ROT scheduler with list of entities; entities need .act() to
    //  lock and unlock engine plus getSpeed() for speed scheduler

    // entities will need to get unloaded and reloaded between floors
    // todo: experiment with floor difference affecting speed/keeping other
    //  floors active. may need dumbed down actions if so or perf will tank
    //  or only special monsters can avoid getting removed from scheduler
    const targetDepth = depth ?? this._currentDepth;
    const scheduler = this.scheduler;
    const ents = this._entities[targetDepth];
    let ent;
    for (let i = 0; i < ents.length; i++) {
      ent = ents[i];
      if (ent.actor) {
        scheduler.add(ents[i], true);
      }
    }
  }

  unloadScheduler() {
    this.scheduler.clear();
  }
// end of Game class definition
};


class Entity extends Glyph {
  constructor(settings, subsettings) {
    super(settings);
    this._game = settings.game;
    this._player = false;
    this._actor = subsettings.actor || true;
    this._name = subsettings.name || 'new buddy';
    this._char = subsettings.char || '?';
    this._mobile = subsettings.mobile || false;
    this._speed = subsettings.speed || 0;
    this._target = subsettings.target || false;
    // todo: calculate hp based on con type stat
    this._MaxHp = subsettings.MaxHp || 5;
    this._hp = subsettings.hp || this._MaxHp;
    this._basePower = subsettings.basePower || 2;
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

  get actor() {
    return this._actor; 
  } 

  get atkPower() {
    // todo: figure in stats + equipment
    return this.basePower;
  }

  get basePower() {
    return this._basePower;
  }

  get hp() {
    return this._hp;
  }

  set hp(value) {
    this._hp = value;
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
    // todo: own .speed attribute for internal use to keep convention
    //   that this can point to
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

  attack(target) {
    // todo: miss chance based on speed
    const damage = Math.max(Math.round(this.atkPower/2),Math.round(
      this.game.getRandom()*this.atkPower));
    console.log(damage);
    target.takeDamage(damage);
  }

  takeDamage(value) {
    //todo: factor in buffs
    this.changeHP(-value);
  }

  healDamage(value) {
    //todo: factor in buffs
    this.changeHP(value);
  }

  changeHP(value) {
      this.hp = this.hp + value;
      if (this.hp <= 0) {
        this.expire();
        this.game.removeEntity(this);
      }
  }

  drop(item) {

  }

  expire() {
    console.log(this.name + ' has expired!');
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
      this.attack(ent);
      return true;
    }

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