//import { Grid } from "./utils.js";
class Stage extends Grid {
  constructor(width, height, settings) {
  super(width, height);
  let worldData = settings.worldData;
  let stageData = worldData.stageData[worldData.depth];
  this._regions = {
    0: [],
  };
  this._fgColor = stageData.fgColor || ['#DDDDDD','#FFFFFF'];
  this._bgColor = stageData.bgColor || ['#000000','#222222'];
  this._regionKeys = null;
  this._depth = worldData.depth || 0;
  this._fov = null;
  // 0th region
  // todo: walls as 0th region
  this._game = settings.game;
  this._stage = null;
  this._mainExit = null;
  }
  
  get regions() {
    return this._regions;
  }

  get regionVolume() {
    let volume = 0;
    let regions = Object.keys(this._regions);
    for (let i = 0; i < regions.length; i++) {
      volume += this.regions[regions[i]].length;
    }
    return volume;
  }
  
  get regionKeys() {
    return Object.keys(this._regions).sort();    
  }

  get fgColor() {
    return this._fgColor;
  }

  get bgColor() {
    return this._bgColor;
  }

  get fov() {
    return this._fov;
  }
  
  set fov(newFov) {
    this._fov = newFov;
  }

  get game() {
    return this._game;
  }

  set depth(newDepth) {
    this._depth = newDepth;
  }

  get firstRegion() {
    return this.regions[this.regionKeys[1]];
  }

  get lastRegion() {
    return this.regions[this.regionKeys[this.regionKeys.length - 1]];
  }

  get mainEntrance() {
    return this._mainEntrance;
  }

  set mainEntrance(entrance) {
    this._mainEntrance = entrance;
  }

  get mainExit() {
    return this._mainExit;
  }

  set mainExit(exit) {
    this._mainExit = exit;
  }

  getTile(coord) {
    // todo: replace game.getTile()
    if (this.contains(coord)) {
      return this.getValue(coord);
    } else {
      return false;
    }
  }

  coordInRegion(coord, region) {
    return this._regions[region].includes(coord);
  }

  setRegion(tile) {
    //todo: getFreeTiles to check for floor tiles to feed
    // into func; check what null tiles do when pulled
    const region = tile.region;
    if (!this._regions[region]) {
      this._regions[region] = [];
    }
    this._regions[region].push(tile.coord);
  }

  getRegion(regionNo) {
    // returns tiles in region
    return this._regions[regionNo];
  
  }

  clearRegion(regionNo) {
    // fills in region with wall tiles
    // console.log(this._regions[regionNo]);
    const tiles = this._regions[regionNo];
    let tile;
    for (let i = 0; i < tiles.length; i++) {
      tile = tiles[i];
      this.setValue(tile, new Tile(this._game.tiles['wall']));
    }
    delete this._regions[regionNo];
    //const game = this.game;
    //let tile, coord;
    //for (let i = 0; i < region.length; i++) {
    //  coord = region[i];
    //  tile = new Tile(game.tiles['floor']);
    //  this.setValue(coord.x, coord.y, tile);
    //}
  }
// end of Stage class
}
