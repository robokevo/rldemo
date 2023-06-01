
APP_SETTINGS.viewData = {
  splash: {
    name: "splash",
    inputs: {
      enter:  function(main) {
        main.changeView("menu");
      },
    },
    load: function() {
      // this.main.getView(viewName).state e.g. can access other states to write directly
      // this.main.getState(viewName) just to read
      this.render();
    },
    render: function() {
      const display = this.display;
      display.drawText(1,1, this.name + " Screen");
    }
  },
  menu: {
    name: "menu",
    inputs: {
      enter:  function(main) {
        console.log("pressed Enter in Menu");
        main.changeView("play");
      },
      escape:  function(main) {
        console.log("pressed Escape in Menu");        
        main.changeView("splash");
      }
    },
    load: function() {
      this.render();
    },
    render: function() {
      const display = this.display;
      display.drawText(1,1, this.name + " Screen");
    }
  },
  play: {
    name: "play",
    inputs: {
      enter:  function() {
        console.log("pressed Enter in Play");
      },
      escape:  function(main) {
        console.log("pressed Escape in Play");        
        main.changeView("menu");
      },
    },
    load: function() {
      if (!this.state) {
        this.state = new Game(this.main.settings.gameData);
        this.state.makeWorld();
      } else {
        console.log(this.state);
      }
      this.render();
    },
    render: function() {
      const display = this.display;
      const game = this.state;
      // rendering game area
      const gameWidth = game.width;
      const gameHeight = game.height;
      for (let x = 0; x < gameWidth; x++) {
        for (let y = 0; y < gameHeight; y++) {
          let tile = game.getTile(x, y);
          display.draw(x, y,
          tile.char,
          tile.fgColor,
          tile.bgColor
          );
        }
      }
    }
  },
}

////////////////////////////////////////////

APP_SETTINGS.gameData = {
  worldData:  {
    depth:        3,
    currentDepth: 0,
    levels:       [],
    width:        120,
    height:       40,

  },
  glyphData: {

  },
  tileData:   {
    wall: {
      char: '#',
    },
    floor: {
      char: '.',
    }
  },
}