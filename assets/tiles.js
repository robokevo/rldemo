class Glyph {
  constructor(settings) {
    this._char = settings.chr || ' ';
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

class Tile {
  constructor(settings, glyph) {
    this._fgColor = settings.fgColor || 'white';
    this._bgColor = settings.bgColor || 'black';
    this._baseGlyph = settings.baseGlyph || '?';
  }

  get glyph() {
    return this._glyph;
  }
}

