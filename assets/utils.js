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

  getDistance(point) {
    // returns distance between two points on the same z level
    return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
  }

  rangePoints(radius) {
    // returns start and end coordinates for a given range
    const range = [];
    range.push({x: this.x - radius, y: this.y - radius, z: this.z});
    range.push({x: this.x + radius, y: this.y + radius, z: this.z});
    return range;
  }  
}

class Grid {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    // todo: test map implementation of data
    this._data = [];
  }
  // check if coordinates are found within
  contains(coord) { 
      return (coord.x >= 0 && coord.x < this._width && coord.y >= 0 && coord.y < this._height); 
  }
    
  getValue(coord) {
    return this._data[coord.x + this._width * coord.y];
  }

  setValue(coord, newValue) {
    if (newValue) {
      newValue.x = coord.x;
      newValue.y = coord.y;
      newValue.z = coord.z;
      this._data[coord.x + this._width * coord.y] = newValue;
    }
  }

  setData(newData) {
  // todo: check for proper array type
    this._data = newData;
  }

  get width() {
      return this._width;
  }
  get height() {
      return this._height;
  }
};

const getMode = (list) => {
  // returns mode of a list
  const counts = {};
  let max = 0;
  let mode = null;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (counts[item]) {
      counts[item]++;
    } else {
      counts[item] = 1;
    }
    if (counts[item] > max) {
      max = counts[item];
      mode = item;
    }
  }
  return mode;
}