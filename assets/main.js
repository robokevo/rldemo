/*//import { test2Exp, testExp } from "./screen2.js";*/

let APP_SETTINGS = {};
document.addEventListener("DOMContentLoaded", function() {
  // todo: Compatibility test
  // 'ROT.isSupported()' from cctut01 deprecated

  // fwiw 'let' support should be a decent first test for our needs
  let supported = true;
  let settings = APP_SETTINGS;
  if (supported) {
    // initializing new ROT display object
    // todo: read window size/media queries during init()
    settings.displayWidth = 80;
    settings.displayHeight = 20;
    // todo: replace with newApp.setTarget()
    settings.appTarget = document.getElementById('app');
    let mainApp = new newApp(settings);
    mainApp.init();
  } else {
    // Compat error
    alert('Please use a modern (e.g., Firefox or Chromium-based) browser');
  }
});

// settings file used to load settings from other files (e.g. screen data)


class newApp {
  constructor(settings) {
    if (settings) {
      this._settings = settings;
      this._displayWidth = settings.displayWidth || 80;
      this._displayHeight = settings.displayHeight || 20;
      this._display = new ROT.Display({
        width: this._displayWidth,
        height: this._displayHeight
      });
      this._viewData = settings.viewData;
      //this._vHandler = new ViewHandler(this);
      this._store = {};
      this._views = {};
      this._activeView = null;
      let view;
      let views = Object.keys(this._viewData);
      // reads through view data, instantiates view objects from settings
      for (const v in views){
        view = new View(this._viewData[views[v]], this);
        this._views[views[v]] = view;
        this._store[views[v]] = null;
      }
      this._container = undefined;
      this._game = settings.game || undefined;
      this._appTarget = settings.appTarget || document.body;
    } else {
      window.alert('oops, refresh the page pls');
    }
  }

  init() {
    this._container = this._display.getContainer();
    // anchor to app div
    this.attach();
    // todo: re-write for combos, codes, action suppression (e.g. arrow key scroll)
    let bindEvent = function(event, main) {
      let self = main;
      window.addEventListener(event, function(e) {
      self.parseInput(e, e.type);
      });
    }
    bindEvent('keydown', this);
    // to-do: soft code start screen into vHandler object
    this.changeView('splash');
  }

  attach() {
    // inserts canvas element into designated div
    this._appTarget.appendChild(this._container);
  }

  parseInput(event, eType) {
    if (eType === 'keydown') {
      this.vHandler.parseInput(event, eType);
    }
  }

  getView(viewName) {
    return this._views[viewName];
  }

  changeView(viewName) {
    let currentView = this._activeView;
    if (currentView) {
      this.view.unload();
      this.view.clear();
    }
    //this._activeScreen = new newApp.Screen();
    if (viewName) {//(!this._activeScreen !== null) {
      this._activeView = this._views[viewName];
      this.view.load();
    }
  }
  
  getState(view) {
    return this._store[view];
  }

  parseInput(input, inputType) {
    // [Enter] moves to next screen
    // todo: handle escaping events (e.g. arrow key scroll, tabbing)
    let newInput;
    const view = this.view;
    if (inputType === 'keydown') {
      //to-do: move lower-casing to per-view level to allow caps inputs
      newInput = input.key.toLowerCase();
      //to-do: view.inputMap instead of directly to inputs to allow remapping
      if (Object.hasOwn(view.inputs, newInput)){
        //to-do: make inputs import as methods like load, etc.
        view.command(newInput);
      } else {
        console.log(newInput);
      };
    }
    
  }

  get views() {
    return this._views;
  }
  
  get view() {
    return this._activeView;
  }

  get inputs() {
    return this._activeView.inputs;
  }

  get settings() {
    return this._settings;
  }
};