// todo: implement with Map(), test render times
class Grid {
  constructor(width, height, data) {
    this._width = width;
    this._height = height;
    this._data = data || [];
  }
  // check if coordinates are found within
  contains(x, y) { 
      return (x >= 0 && x < this._width && y >= 0 && y < this._height); 
  }
    
  getValue(x, y) {
    return this._data[x + this._width * y];
  }

  setValue(x, y, newValue) {
    if (newValue) {
      this._data[x + this._width * y] = newValue;
    }
  }

  get width() {
      return this._width;
  }
  get height() {
      return this._height;
  }
}; 