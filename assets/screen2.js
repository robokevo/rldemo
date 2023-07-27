class View {
  // Window manager for a screen comprised of panels;
  // manages input handling between active and inactive panels
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
    this._panels = [];
    this._panelList = null;
    this._activePanel = null;
    this._bgColor = settings.bgColor || 'black';
    this._fgColor = settings.fgColor || 'white';
    this._fontStyle = settings.fontStyle || 'normal';
    this._title = settings.title || '';
  }

  get activePanel() {
    return this._activePanel;
  }
  
  get bgColor() {
    // todo: link to stage background color
    return this._bgColor;
  }

  get fgColor() {
    return this._fgColor;
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

  get panels() {
    return this._panels;
  }

  get state() {
    return this.main.getState(this.name);
  }

  set state(state) {
    this.main._store[this.name] = state;
  }

  load(params) {
    if (this._load) {
      this._load(params);
    };
    const display = this.display;
    const bgColor = this.bgColor ?? 'blue';
    const fgColor = this.fgColor ?? 'white';
    const fontStyle = this.fontStyle || 'normal';
    display.setOptions({
      bg: bgColor,
      fg: fgColor,
      fontStyle: fontStyle,
    });
    console.log("Entered " + this.name + " screen");
  }
  unload() {
    if (this._unload){
      this._load(params);
    };
    console.log("Exited " + this.name + " screen");
  }
  render() {
    this._render()
    for (let i = 0; i < this.panels.length; i++) {
      this.panels[i].render();
    }
  }
  clear() {
    this.display.clear();
  }
  
  command(input){
    // [Enter] moves to next screen
    // todo: handle escaping events (e.g. arrow key scroll, tabbing)
    this.inputs[input](this.main);
  }

  setPanels(panels) {
    // initialize panels
    const panelList = Object.keys(panels);
    let panel, name;
    for (let i = 0; i < panelList.length; i++) {
      name = panelList[i];
      panel = new Panel(panels[name], this);
      this._panels.push(panel);
    }
    this._panels.sort(function(a, b) {
        if (a.order < b.order) {
          return -1;
        } else {
          return 1;
        }
    });
    
  }
  
  // End of View class
}

class Panel {
  // Window elements managed by views
  // todo: foreground and background colors

  constructor(settings, view) {
    // todo: auto-width calculation based on canvas size
    this._view = view;
    this._name = settings.name || 'New Panel';
    this._inputs = settings.inputs || {};
    this._render = settings.render;
    this._load = settings.load || null;
    this._unload = settings.unload || null;
    this._origin = settings.origin || {x: 0, y: 0};
    this._borderWidth = settings.borderWidth || 0;
    this._coreWidth = settings.width || 0;
    this._coreHeight = settings.height || 0;
    this._title = settings.title || '';
    this._corners = settings.corners || [];
    this._bgColor = settings.bgColor || null;
    this._fgColor = settings.fgColor || null;
  }  

  get inputs() {
    // keyboard inputs for this panel
    return this._inputs;
  }

  get bgColor() {
    if (this._bgColor === null) {
      return this._view.bgColor;
    } else {
    return this._bgColor
    };
  }

  get fgColor() {
    if (this._fgColor === null) {
      return this._view.fgColor;
    } else {
    return this._fgColor
    };
  }

  get borderWidth() {
    return this._borderWidth;
  }

  get corners() {
    return this._corners;
  }

  get origin() {
    return this._origin;
  }

  get name() {
    return this._name;
  }

  get width() {
    return this._coreWidth + this._borderWidth;
  }

  get height() {
    return this._coreHeight + this._borderWidth;
  }

  get title() {
    return this._title;
  }

  get view() {
    return this._view;
  }

  load(params) {
    if (this._load) {
      this._load(params);
    }
  }

  render(params) {
    // todo: rendering through panels based on priority
    if (this._render) {
      this._render(params);
    }
  }

}
