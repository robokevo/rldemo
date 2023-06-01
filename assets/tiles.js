class Glyph {
  constructor(settings) {
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
  }
}

