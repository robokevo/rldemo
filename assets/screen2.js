class View {
  constructor(settings, main) {
    // todo: parent class for screen elements to pull references from main?
    if (settings.load) {
      this._load = settings.load;
    }
    if (settings.render) {
      this._render = settings.render;
    }
    this._main = main;
    this._display = this._main._display;
    this._inputs = settings.inputs || {};
    this._name = settings.name || 'New View';
  }

  get main() {
    return this._main;
  }

  get inputs() {
    return this._inputs;
  }

  get name() {
    return this._name;
  }

  get display() {
    return this._display;
  }

  get state() {
    return this.main.getState(this.name);
  }

  set state(state) {
    this.main._store[this.name] = state;
  }

  load(params) {
    if (this._load){
      this._load(params);
    };
    console.log("Entered " + this.name + " screen");
  }
  unload() {
    if (this._unload){
      this._load(params);
    };
    console.log("Exited " + this.name + " screen");
  }
  render() {
    this._render();
  }
  clear() {
    this.display.clear();
  }
  
  command(input){
    // [Enter] moves to next screen
    // todo: handle escaping events (e.g. arrow key scroll, tabbing)
    this.inputs[input](this.main);
  }
    
}

