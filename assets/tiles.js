class Glyph extends Point {
  constructor(settings) {
    super(settings);
    this._char = settings.char || ' ';
    this._fgColor = settings.fgColor || 'white';
    this._bgColor = settings.bgColor || 'black';
  }

  get char() {
    return this._char;
  }

  get bgColor() {
    return this._bgColor;
  }

  get fgColor() {
    return this._fgColor;
  }

  get settings() {
    return this.settings;
  }

}

class Tile extends Glyph{
  constructor(settings) {
    super(settings)
    this._stage = null;
    this._destructible = settings.destructible ?? false;
    this._passable = settings.passable ?? false;
    this._destroyed = settings._destroyed ?? 'floor';
    this._region = settings.region ?? null;
    this._exit = settings.exit ?? false;
    this._direction = settings.direction ?? null;
    this._transparent = settings.transparent ?? false;
    this._lastKnown = null;
  }

  get destructible() {
    return this._destructible;
  }

  get passable() {
    // todo: check if there's an entity that is passable on tile
    return this._passable;
  }

  get transparent() {
    return this._transparent;
  }

  // todo: delete this after test
  get char() {
    if (this.exit) {
      return this._char;
    }
    if (this.region > 0) {
      return this.region;
    } else {
      return this._char;
    }
  }

  get direction() {
    return this._direction;
  }

  get destroyed() {
    return this._destroyed;
  }

  get exit() {
    return this._exit;
  }

  get occupied() {
    //todo: see if needed, insert game.getEntity()
    return;
  }

  get lastKnown() {
    // todo: implement 'concussion' or things to forget
    return this._lastKnown;
  }

  set lastKnown(char) {
    this._lastKnown = char;
  }

  get region() {
    if (this._region === null) {
      return -1;
    } else {
      return this._region;
    }
  }

  set region(region) {
    this._region = region;
  }

  get stage() {
    return this._stage;
  }

  set stage(stageData) {
    this._stage = stageData;
  }

  rend() {
    // perform 'on-death' actions (e.g. drop loot)
    // todo: anything
    return;
  }
// end of Tile class
}

