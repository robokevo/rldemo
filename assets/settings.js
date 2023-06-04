
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
      arrowup: function(main) {
        main.view.state.move(0,-1);
        main.view.render();
        console.log('up');
      },
      arrowdown: function(main) {
        main.view.state.move(0,1);
        main.view.render();
        console.log('down');
      },
      arrowleft: function(main) {
        main.view.state.move(-1,0);
        console.log('left');
        main.view.render();
      },
      arrowright: function(main) {
        main.view.state.move(1,0);
        console.log('right');
        main.view.render();
      },
    },
    load: function() {
      if (!this.state) {
        // passing view into game object for easier rendering
        this.state = new Game(this.main.settings.gameData, this);
        this.state.makeWorld();
      } else {
        console.log(this.state);
      }
      this.render();
    },
    render: function() {
      const display = this.display;
      const game = this.state;
      const main = this.main;
      // rendering game area
      const gameWidth = game.width;
      const gameHeight = game.height;
      const dHeight = main.displayHeight;
      const dWidth = main.displayWidth;
      const cursor = game.cursor;
      // todo: link top left xy to specific panel
      // to bind player view to stage, use the following:
      // let topLeftX = Math.max(0, cursor.x - (dWidth/2));
      // let topLeftY = Math.max(0, cursor.y - (dHeight/2));
      const topLeftX = cursor.x - (dWidth/2);
      const topLeftY = cursor.y - (dHeight/2);
      // iterating through map tiles and rendering
      // todo: concat a row of glyphs and call drawText instead of individual calls
      for (let x = topLeftX; x < topLeftX + dWidth; x++) {
        for (let y = topLeftY; y < topLeftY + dHeight; y++) {
          let tile = game.getTile(x, y);
          //if (!tile) {
          //  alert('uhoh');
          //}
          display.draw(
          x - topLeftX,
          y - topLeftY,
          tile.char,
          tile.fgColor,
          tile.bgColor
          );
        }
      }
      // render cursor
      display.draw(
        // when corner is out of bounds, topleft values go negative and center cursor
        cursor.x-topLeftX,
        cursor.y-topLeftY,
        '\u{1F468}\u{1f3fd}\u{200D}\u{1f680}',
        //'blue',
        //'green'
      );
    },
  },
}

////////////////////////////////////////////
APP_SETTINGS.appData = {
  startWidth: 80,
  startHeight: 24,
};

APP_SETTINGS.gameData = {
  worldData:  {
    depth:        6,
    currentDepth: 0,
    levels:       [],
    width:        200,
    height:       120,

  },
  glyphData: {

  },
  tileData:   {
    wall: {
      char: '\u{1faa8}',
      fgColor: 'black',
      bgColor: 'gray',
    },
    floor: {
      char: '.',
      fgColor: 'saddlebrown',
      bgColor: 'sienna',
    },
    none: {
      char: '~',
      fgColor: 'saddlebrown',
      bgColor: 'darkred',
    }
  },
}