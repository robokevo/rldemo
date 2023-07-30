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
    //settings.appData.displayWidth = 80;
    //settings.appData.displayHeight = 20;
    // todo: replace with newApp.setTarget()
    settings.appData.appTarget = document.getElementById('app');
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
      let appSettings = settings.appData;
      // to
      this._displayWidth = appSettings.startWidth || 80;
      this._displayHeight = appSettings.startHeight || 20;
      this._display = new ROT.Display({
        width: this._displayWidth,
        height: this._displayHeight,
        spacing: 1,
        forceSquareRatio: true,
        fontStyle: 'bold',
        fontSize: '13',
        //does this work?
        textAlign: 'left',
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
        const panelData = this._viewData[views[v]].panels;
        view = new View(this._viewData[views[v]], this);
        if (panelData) {
          view.setPanels(panelData);
        }
        this._views[views[v]] = view;
        this._store[views[v]] = null;
      }
      this._container = undefined;
      this._game = settings.game || undefined;
      // target div to anchor canvas
      this._appTarget = appSettings.appTarget || document.body;
      // input throttle in ms to avoid keyboard spam
      // todo: make sure throttle doesn't interfere with input timing
      //  or see if negative throttle on views can balance
      // (e.g. smaller amount of throttle needed for real time engine)
      this._globalThrottle = appSettings.globalThrottle || 40;
      this._lastInputTime = 0;
      // to-do: input log for combos
      } else {
      window.alert('Big Ope: no settings detected. Plz refresh the page pls');
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
    // todo: soft code start screen into vHandler object
    this.changeView('splash');
  }

  attach() {
    // inserts canvas element into designated div
    this._appTarget.appendChild(this._container);
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
    let time = Date.now();
    if (time - this.lastInputTime>this.globalThrottle) {
      if (inputType === 'keydown') {
        //todo: move lower-casing to per-view level to allow caps inputs
        newInput = input.key.toLowerCase();
        //todo: view.inputMap instead of directly to inputs to allow remapping
        if (Object.hasOwn(view.inputs, newInput)){
          //todo: make inputs import as methods like load, etc.
          view.command(newInput);
        } else {
          console.log(newInput);
        };
      }
    this.lastInputTime = time;  
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

  get displayWidth() {
    return this._displayWidth;
  }

  get displayHeight() {
    return this._displayHeight;
  }

  get lastInputTime() {
    return this._lastInputTime;
  }

  set lastInputTime(inputTime) {
    this._lastInputTime = inputTime;
  }

  get globalThrottle() {
    // to-do: add view's throttle and return sum
    return this._globalThrottle;
  }

  set globalThrottle(newGThrot) {
    // this should only set the global setting and not interfere with views
    this._globalThrottle = newGThrot;
  }
  
};