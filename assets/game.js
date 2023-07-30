class Game {
  constructor(settings) {
    // todo: abstract out to universe that holds worlds with discrete stages
    settings.game = this;
    this._settings = settings;
    this._depth = settings.worldData.depth;
    this._stages = settings.worldData.stages;
    this._width = settings.worldData.width;
    this._height = settings.worldData.height;
    // start paused to do game setup, then pause/unpause
    // when toggling in and out of game screen
    this._paused = true;
    // todo: specific tiles for biomes
    this._tiles = settings.tileData;
    this._noTile = new Tile(this._tiles['none']);
    this._currentDepth = settings.worldData.currentDepth || 0;
    //this._stages[this._currentDepth] = new Grid(this._width,this._height);
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

  get paused() {
    return this._paused;
  }

  get currentDepth() {
    // sets working depth of game object
    return this._currentDepth;
  }

  set currentDepth(newDepth) {
    // sets working depth of game object
    this._currentDepth = newDepth;
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

  get stage() {
    return this._stages[this._currentDepth];
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

  addEntity(entity,coord) {
    //todo: check for entity as well as free tile
    if (!coord) {
      let freeXYZ = this.freeTile();
      entity.x = freeXYZ.x;
      entity.y = freeXYZ.y;
      entity.z = freeXYZ.z;
    } else {
      entity.x = coord.x;
      entity.y = coord.y;
      entity.z = coord.z;
    }
    this.entities.push(entity);
    if (!this.paused) {
      this.scheduler.add(entity, true);
    }
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

  entitiesInRange(startXY, endXY) {
    // returns a list of entities in given range
    const tiles = this.getTiles(startXY, endXY);
    let entList = [];
    let ent, coord;
    for (let i = 0; i < tiles.length; i++) {
      coord = tiles[i];
      ent = this.getEntity(coord); 
      if (ent) {
        entList.push(ent);
      }
    }
    return entList;
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
      width = this.stage.width;
      height = this.stage.height;
    }
    // start with invalid coord to start search; valid depth needed or error
    let coord = {x:-1,y:-1,z:this._currentDepth};
    if ((xOffset === 0) && (yOffset === 0) &&
      (width === this.stage.width) && (height === this.stage.height)) {
      // warning: can hang if no valid target found
      // this method only used when placing through whole map
      // todo: refactor to use getFreeTiles for stage pop
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
      const freeTiles = this.getFreeTiles(startXY, endXY);
      if (freeTiles.length > 0) {
        let choice = this.getRandomInt(0, freeTiles.length - 1);
        return this.getTile(freeTiles[choice]);
      } else {
        return false;
      }
    }

  }
  
  getTile(coord) {
    // retrieves contents of a tile
    const newZ = coord.z ?? this._currentDepth;
    const [x, y] = [coord.x,coord.y];
    if (this._stages[newZ].contains(x,y)) {
      return this.stage.getValue(x, y);
    } else {
      return this.noTile;
    }
  }

  getTiles(startXY, endXY) {
    // returns coordinates for a range of tiles; coordinates will then be fed
    // into other funcs (e.g. freeTile() for finding empty tiles)
    const tiles = [];
    let coord;
    const width = endXY.x - startXY.x;
    const height = endXY.y - startXY.y;
    for (let i = startXY.x; i <= startXY.x + width; i++) {
      for (let j = startXY.y; j <= startXY.y + height; j++) {
        coord = {x: i, y: j};
        tiles.push(coord);
      }
    }
    // shuffle tiles before return to avoid bias of starting tile
    // have to shuffle with getRandom() to make reproduceable w/ seed
    return tiles.sort(()=> this.getRandom() - 0.5);
  }

  getFreeTiles(startXY, endXY) {
    // returns coordinates for a range of free tiles; coordinates will then be
    // fed into other funcs (e.g. freeTile() for finding empty tiles)
    const tiles = this.getTiles(startXY, endXY);
    const freeTiles = [];
    let tile;
    for (let i = 0; i < tiles.length; i++) {
      tile = tiles[i];
      if (this.isTileFree(tile)) {
        freeTiles.push(tile);
      }
    }
    return freeTiles;
  }

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

  isTileFree(coord) {
    const coordCheck = this.getEntity(coord);
    // todo: if entities are gaseous etc. implement passable
    if (!coordCheck && this.getTile(coord).passable) {
        return true;
    }
    return false;
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

  makeStage(currentDepth) {
    let depth = currentDepth || 0;
    const generator = new ROT.Map.Cellular(this.width, this.height);
    generator.randomize(0.5);
    const iterations = 1;
    // every iteration smoothens map
    for (let i = 0; i < iterations; i++){
      generator.create();
    }
    const newStage = new Stage(this.width, this.height);
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
        newStage.setValue(x,y,newTile);
      } else {
        newTile = new Tile(game._tiles['wall']);
        newTile.x = x;
        newTile.y = y;
        newTile.z = currentDepth;
        newStage.setValue(x,y,newTile);
      }

    });
    this._stages[depth] = newStage;
  }

  makeWorld() {
    for (let i = 0; i < this.depth; i++) {
      this.makeStage(i);
    }
    this.populateStages();
  }

  move(entity, coord) {
    if (this._stages[coord.z].contains(coord.x,coord.y)) {
      entity.x = coord.x;
      entity.y = coord.y;
      entity.z = coord.z;
      return true;
    }
  }

  newEntity(name, target) {
    // todo: secondary settings for configuring base entity from emoji
    const ent = new Entity(
      this.settings,
      this.settings.entityData.bestiary[name]
      );
    this.addEntity(ent, target);
  }

  newTile(tileType) {
    //todo: stage/biome support for varied tiles
    const newTile = new Tile(this._tiles[tileType]);
    return newTile;
  }

  populateStages() {
    let allSettings = this.settings;
    let entitySettings = allSettings.entityData;
    let stageSettings;
    for (let i = 0; i < this.depth; i++){
      this.currentDepth = i;
      stageSettings = entitySettings.stageData[i];
      if (stageSettings) {
        let entities = Object.keys(stageSettings);
        for (let j = 0; j < entities.length; j++) {
          let entity = entities[j];
          let entDetails = stageSettings[entity];
          let instance;
          for (let k = 0; k < entDetails.qty; k++) {
            instance = new Entity(this.settings, entitySettings.bestiary[entity]);
            this.addEntity(instance);
          }
        }
      }
    }
    this.currentDepth = this.settings.worldData.currentDepth;
  }

  pause() {
    this._paused = true;
  }

  removeEntity(entity) {
    let entities = this.entities;
    let ent;
    for (let i = 0; i < entities.length; i++) {
      ent = entities[i];
      if (ent===entity) {
        if (entity.actor) {
          this.scheduler.remove(entity);
        };
        entities.splice(i,1);
        break
      }
    }
  }  
  
  sendMessage(message, sender, radius) {
    // sends a message to entities in range
    // todo: ability to flag if messages need line of sight/hearing via A*
    const range = sender.rangePoints(radius);
    const entList = this.entitiesInRange(range[0],range[1]);
    let ent;
    for (let i = 0; i < entList.length; i++) {
      ent = entList[i];
      if (ent.hearing) {
        ent.receiveMessage(message);
      }
    }
  }

  setTile(coord, value) {
    const [x,y,z] = [coord.x,coord.y,coord.z]; 
    this._stages[z].setValue(x,y,value);
  }

  unloadScheduler() {
    this.scheduler.clear();
  }

  unpause() {
    this._paused = false;
  }
// end of Game class definition
};