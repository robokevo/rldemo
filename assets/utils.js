// todo: implement with Map(), test render times
class Point {
  constructor(coord) {
    this._x = coord.x;
    this._y = coord.y;
    this._z = coord.z;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get z() {
    return this._z;
  }

  get coord() {
    return {x: this._x, y: this._y, z: this._z};
  }
  

  set x(newX) {
    this._x = newX;
  }

  set y(newY) {
    this._y = newY;
  }

  set z(newZ) {
    this._z = newZ;
  }

  rangePoints(radius) {
    // returns start and end coordinates for a given range
    const range = [];
    range.push({x: this.x - radius, y: this.y - radius});
    range.push({x: this.x + radius, y: this.y + radius});
    return range;
  }  
}

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