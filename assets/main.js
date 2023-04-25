let APP_SETTINGS = {}
document.addEventListener("DOMContentLoaded", function() {
  // todo: Compatibility test
  // 'ROT.isSupported()' from cctut01 deprecated

  // fwiw 'let' support should be a decent test for our needs
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
    //mainApp.switchScreen(mainApp._screens.startScreen);
  } else {
    // Compat error
    alert('Please use Firefox or a Chromium-based browser');
  }
});

// settings file used to load settings from other files (e.g. screen data)


class newApp {
  constructor(settings) {
    if (settings) {
      settings.main = this;
      this._settings = settings;
      this._screenList = this._settings.screenList;
      this._screen = new newApp.Screen(this);
      this._container = undefined;
      this._display = undefined;
      this._appTarget = settings.appTarget || document.body;
      this._displayWidth = settings.displayWidth || 80;
      this._displayHeight = settings.displayHeight || 20;
    } else {
      window.alert('oops, refresh the page pls');
    }
  }

  static Screen = class {
    constructor(main) {
      // todo: parent class for screen elements to pull references from main
      this._main = main;
      this._activeScreen = null;
    }

    get main() {
      return this._main;
    }

    get inputs(){
      return this._activeScreen.inputs;
    }

    get name(){
      return this._activeScreen.name;
    }
    enter() {
      console.log("Entered " + this.name + " screen");
    }
    exit() {
      console.log("Exited " + this.name + " screen");
    }
    render() {
      const display = this.main.display;
      // renders prompt to screen
      display.drawText(1,1, this.name + " Screen");
    }
    handleInput(input, inputType) {
      // [Enter] moves to next screen
      // todo: keep on up status of .hasOwn() support
      let newInput
      if (inputType === 'keydown') {
        newInput = input.key
        if (this.inputs.hasOwnProperty(newInput)){
          this.inputs[newInput](this.main);
        } else {
          console.log(newInput);
        };
      }
      
    }

    clear() {
      this.main.display.clear();
    }

    switch(screenName) {
      // Transitions between different screens
      // Check for current screen to exit, then clears and renders
      let currentScreen = this._activeScreen;
      if (currentScreen) {
        this.exit();
      }
      this.clear();
      //this._activeScreen = new newApp.Screen();
      if (screenName) {//(!this._activeScreen !== null) {
        this._activeScreen = this.main._screenList[screenName];
        this.enter();
        this.render();
      }
    }


  };

  init() {
    this._display = new ROT.Display({
      width: this._displayWidth,
      height: this._displayHeight
    });
    this._container = this.display.getContainer();
    // anchor to app div
    this.attach();
    // todo: re-write for combos, codes, action suppression (e.g. arrow key scroll)
    let bindEvent = function(event, main) {
      let self = main;
      window.addEventListener(event, function(e) {
      self.handleInput(e, e.type);
      });
    }
    bindEvent('keydown', this);
    this.screen.switch('splash');
  }

  attach() {
    // inserts canvas element into designated div
    this._appTarget.appendChild(this._container);
  }

  get display() {
    return this._display;
  }

  get screen() {
    return this._screen;
  }

  handleInput(event, eType) {
    if (eType === 'keydown') {
      this.screen.handleInput(event, eType);
    }
  }

};