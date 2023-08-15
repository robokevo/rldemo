class Game {
  constructor(settings) {
    // todo: abstract out to universe that holds worlds with discrete stages
    settings.game = this;
    // will be used to determine initial directionality of stages
    this._bias = null;
    this._settings = settings;
    this._depth = settings.worldData.depth;
    this._stages = settings.worldData.stages ?? [];
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

  get bias() {
    // will be used to determine level directionality,
    // possibly other coinflips for flavor
    if (this._bias === null) {
      this._bias = this.coinFlip;
    }
    return this._bias;
  }

  get coinFlip() {
    // returns 0 or 1 to be used as a boolean
    return this.getRandomInt(0,1);
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

  set depth(newDepth) {
    this._depth = newDepth;
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

  get stages() {
    return this._stages;
  }
  
  get tiles() {
    return this._tiles;
  }

  get noTile() {
    return this._noTile;
  }

  get view() {
    return this._view;
  }

  entities(depth) {
    const targetDepth = depth ?? this.currentDepth;
    return this._entities[targetDepth];
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
    let depth;
    if (!coord) {
      let freeXYZ = this.freeTile();
      entity.x = freeXYZ.x;
      entity.y = freeXYZ.y;
      depth = entity.z = freeXYZ.z;
    } else {
      entity.x = coord.x;
      entity.y = coord.y;
      depth = entity.z = coord.z;
    }
    this.entities(depth).push(entity);
    if (!this.paused) {
      this.scheduler.add(entity, true);
    }
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
    // returns entity at given tile if there, else returns false
    const z = coord.z ?? this._currentDepth;
    const [x, y] = [coord.x, coord.y];
    //todo: does entities need to get moved to a grid or map object?
    const entList = this.entities(coord.z);
    let result = false;
    let ent;
    if (entList.length>0) {
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
    let depth = this.currentDepth ?? 0;
    let coord = {x:-1,y:-1,z:depth};
    let firstXY, lastXY;
    if ((xOffset === 0) && (yOffset === 0) &&
      (width === this.stage.width) && (height === this.stage.height)) {
      // warning: can hang if no valid target found
      // this method only used when placing through whole map
      // todo: refactor to use getFreeTiles for stage pop
        //while (!this.isTileFree(coord)) {
        //  coord.x = Math.floor(this.getRandom() * width);
        //  if ((coord.x > (width - buffer)) || (coord.x <= buffer)) {
        //    coord.x = -1;
        //  }
        //  coord.y = Math.floor(this.getRandom() * height);
        //  if ((coord.y > (height - buffer)) || (coord.y <= buffer)) {
        //    coord.y = -1;
        //  }
        //  freeTile = this.getTile(coord);
        //}
      firstXY = {x:5,y:5};
      lastXY = {x:width-5,y:height-5};
      //return freeTile;
    } else {
      firstXY = startXY;
      lastXY = endXY;
      //const freeTiles = this.getFreeTiles(startXY, endXY);
      //if (freeTiles.length > 0) {
      //  let choice = this.getRandomInt(0, freeTiles.length - 1);
      //  return this.getTile(freeTiles[choice]);
      //} else {
      //  return false;
      //}
    }
    const freeTiles = this.getFreeTiles(firstXY, lastXY);
    if (freeTiles.length > 0) {
      let choice = this.getRandomInt(0, freeTiles.length - 1);
      return this.getTile(freeTiles[choice]);
    } else {
      return false;
    }
  }
  
  getTile(coord) {
    // retrieves contents of a tile
    const newZ = coord.z ?? this.currentDepth;
    if (this._stages[newZ].contains(coord)) {
      return this.stages[newZ].getValue(coord);
    } else {
      return false;
    }
  }

  setTile(coord, value) {
    this._stages[coord.z].setValue(coord,value);
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

  getTiles(startXY, endXY) {
    // returns coordinates for a range of tiles; coordinates will then be fed
    // into other funcs (e.g. freeTile() for finding empty tiles)
    const tiles = [];
    let coord;
    const width = endXY.x - startXY.x;
    const height = endXY.y - startXY.y;
    for (let i = startXY.x; i <= startXY.x + width; i++) {
      for (let j = startXY.y; j <= startXY.y + height; j++) {
        coord = {x: i, y: j, z: this.currentDepth};
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
    const tile = this.getTile(coord);
    let result = false;
    if (tile) {
      const coordCheck = this.getEntity(coord);
      // todo: if entities are gaseous etc. implement passable
      if (!coordCheck && tile.passable) {
          result = true;
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
    const targetDepth = depth ?? this.currentDepth;
    const scheduler = this.scheduler;
    const ents = this.entities(targetDepth);
    let ent;
    for (let i = 0; i < ents.length; i++) {
      ent = ents[i];
      if (ent.actor) {
        scheduler.add(ents[i], true);
      }
    }
  }

  makeStage(currentDepth) {
    const depth = currentDepth || 0;
    let pass = false;
    while (!pass) {
    // todo: not constrain map size to static game size
      const generator = new ROT.Map.Cellular(this.width, this.height);
      generator.randomize(0.5);
      const iterations = 10;
      // every iteration smoothens map
      for (let i = 0; i < iterations; i++){
        generator.create();
      }
      let newStage = new Stage(this.width, this.height, this);
      newStage.depth = depth;
      this._stages[depth] = newStage;
      // iterate one last time to write to map
      // have to call this locally to be accessed within generator
      let game = this;
      //generator.connect() would trip up region setup later
      generator.create(function(x,y,v){
        let newTile;
        let coord = {x: x, y: y, z: depth};
        if (v === 1) {
          newTile = new Tile(game.tiles['floor']);
          //newTile.x = x;
          //newTile.y = y;
          newTile.z = currentDepth;
          newStage.setValue(coord,newTile);
        } else {
          newTile = new Tile(game.tiles['wall']);
          //newTile.x = x;
          //newTile.y = y;
          newTile.z = currentDepth;
          newStage.setValue(coord,newTile);
        }
      });
      // walking map for region setup
      let coord = {x: 0, y: 0};
      let queue = [];
      let regionIndex = 0;
      let range, neighbors;
      for (let i = 0; i < this.width; i++) {
        for (let j = 0; j < this.height; j++) {
          coord.x = i;
          coord.y = j;
          coord.z = currentDepth;
          let tile = game.getTile(coord);
          if (tile.passable) {
            if (tile.region < 0) {
              // todo: set walls as region 0
              regionIndex++;
              tile.region = regionIndex;
              newStage.setRegion(tile);
              range = tile.rangePoints(1);
              queue = game.getFreeTiles(range[0], range[1]);
              while (queue.length > 0) {
                let tileCoord = queue.shift();
                tile = game.getTile(tileCoord);
                tile.region = regionIndex;
                newStage.setRegion(tile);
                range = tile.rangePoints(1);
                neighbors = game.getFreeTiles(range[0], range[1]);
                for (let k = 0; k < neighbors.length; k++) {
                  tile = game.getTile(neighbors[k]);
                  if (tile.region < 0) {
                    if (queue.indexOf(tile) === -1) {
                      queue.push(tile)
                    };
                  }
                }
              }
            }
          }
        }
      }
      // todo: implement this at stage init level
      // i = 1 to skip walls
      let regionList = newStage.regionKeys;
      for (let i = 1; i < regionList.length; i++) {
        if (newStage.getRegion(i).length < 50) {
          newStage.clearRegion(i);
        }
      }
      let minVolume = 500;
      let minRegions = 5;
      let maxRegions = 7;
      regionList = newStage.regionKeys;
      let regionCount = regionList.length;
      let regionVolume = newStage.regionVolume;
      let index, targets, target;
      if (regionVolume > minVolume && 
        regionCount >= minRegions &&
        regionCount <= maxRegions) {
        if (depth === 0) {
          if (this.bias) {
            // bias starts toward 'end' region
            index = regionList[regionCount-1]
          } else {
            // no bias skips wall region, starts at 1+
            index = regionList[1];
          }
          targets = newStage.regions[index];
          let target = this.getTile(
            targets[this.getRandomInt(1,targets.length-1)]
          );
          //let exit = new Tile(game.tiles['hole']);
          //newStage.mainExit = exit;
          //exit.region = target.region;
          //this.setTile(target, exit);
          pass = true
        } else {
          const lastStage = game.stages[depth-1];
          let lastTargets, exitTarget, enterTarget;
          if (this.bias && (depth % 2 > 0)) {
            lastTargets = lastStage.lastRegion;
          } else if (!this.bias && (depth % 2 > 0)) {
            lastTargets = lastStage.firstRegion;
          } else if (this.bias && (depth % 2 === 0)) {
            lastTargets = lastStage.firstRegion;
          } else {
            lastTargets = lastStage.lastRegion;
          }
          for (let i = 0; i < lastTargets.length; i++) {
            let exitCoord = lastTargets[i];
            let enterCoord = {};
            [enterCoord.x, enterCoord.y, enterCoord.z] = [exitCoord.x, exitCoord.y, exitCoord.z + 1];
            exitTarget = game.getTile(exitCoord);
            enterTarget = game.getTile(enterCoord);
            if (enterTarget.passable && exitTarget.passable && !pass) {
              let exit = new Tile(game.tiles['hole']);
              //lastStage.mainExit = exit;
              exit.region = exitTarget.region;
              this.setTile(exitTarget, exit);
              console.log(exit);
              let entrance = new Tile(game.tiles['ladder']);
              entrance.region = enterTarget.region;
              this.setTile(enterTarget, entrance);
              //console.log(lastStage.mainExit);
              //console.log(lastStage.mainEntrance);
              pass = true
            }
            
          }
          //// even levels are modulo 1 because depth is index 0
          //if (depth % 2 > 0) {
          ////  console.log(this.bias);
          ////  console.log(this.coinFlip);
          //}
        }
        //console.log(newStage.regions);
      }
    }
  // end of makeStage()
  }

  makeWorld() {
    const startDepth = this.currentDepth;
    for (let i = 0; i < this.depth; i++) {
      this.currentDepth = i;
      this.makeStage(i);
    }
    this.populateStages();
    this.currentDepth = startDepth;
  }

  move(entity, coord) {
    if (this._stages[coord.z].contains(coord)) {
      entity.x = coord.x;
      entity.y = coord.y;
      if (coord.z != this.currentDepth) {
        //game.pause();
        //this.removeEntity(entity);
        entity.z = coord.z;
        //this.currentDepth = coord.z;
        //this.addEntity(entity);
        //console.log(this._entities[coord.z].splice(this._entities[coord.z].indexOf(entity)[0], 1));
        //this._entities[coord.z].push(entity);
        if (entity.player) {
          // todo: have scheduler keep all entities, only entities within
          // x no. of floors will
          //this.unloadScheduler();
          //this.loadScheduler(entity.z);
        }
        //game.unPause();
      }
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
    let startingDepth = this.currentDepth;
    let stage, target, targets;
    let index, regionList, regionCount;
    for (let i = 0; i < this.depth; i++){
      this.currentDepth = i;
      stage = this.stage;
      regionList = stage.regionKeys;
      regionCount = regionList.length;
      stageSettings = entitySettings.stageData[i];
      if (i === 0) {
        if (this.bias) {
          // bias starts toward 'end' region
          index = regionList[1];
        } else {
          // no bias skips wall region, starts at 1+
          index = regionList[regionCount-1];
        }
        targets = stage.regions[index];
        target = targets[this.getRandomInt(1,targets.length-1)];
        let player = this.player;
        this.addEntity(player, target);
      }
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
    this.currentDepth = startingDepth;
  }

  pause() {
    this._paused = true;
  }

  removeEntity(entity) {
    let entities = this.entities(entity.z);
    let ent;
    for (let i = 0; i < entities.length; i++) {
      ent = entities[i];
      if (ent===entity) {
        if (entity.actor && this.paused) {
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

  unloadScheduler() {
    this.scheduler.clear();
  }

  unPause() {
    this._paused = false;
  }
// end of Game class definition
};