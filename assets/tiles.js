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
    this._destructible = settings.destructible || false;
    this._passable = settings.passable || false;
    this._destroyed = settings._destroyed || 'floor';
  }

  get destructible() {
    return this._destructible;
  }

  get passable() {
    // todo: check if there's an entity that is passable on tile
    return this._passable;
  }

  get destroyed() {
    return this._destroyed;
  }

  get occupied() {
    //todo: see if needed, insert game.getEntity()
    return;
  }

  rend() {
    // perform 'on-death' actions (e.g. drop loot)
    // todo: anything
    return;
  }
}

