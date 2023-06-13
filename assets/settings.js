
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
        const game = main.view.state;
        const result = game.player.tryPos({x:0,y:-1,z:0});
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
        console.log('up');
      },
      arrowdown: function(main) {
        const game = main.view.state;
        const result = game.player.tryPos({x:0,y:1,z:0});
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
        console.log('down');
      },
      arrowleft: function(main) {
        const game = main.view.state;
        const result = game.player.tryPos({x:-1,y:0,z:0});
        console.log('left');
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      arrowright: function(main) {
        const game = main.view.state;
        const result = game.player.tryPos({x:1,y:0,z:0});
        console.log('right');
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      t:  function(main) {
        console.log(main.view.state.player);
      }
    },
    load: function() {
      if (!this.state) {
        // passing view into game object for easier rendering
        this.state = new Game(this.main.settings.gameData, this);
        game = this.state;
        game.makeWorld();
        game.addEntity(this.state.player);
        game.loadScheduler();
        game.engine.start();
      } else {
        console.log(game);
      }
      this.render();
    },
    render: function() {
      const display = this.display;
      const game = this.state;
      const player = game.player;
      const main = this.main;
      // rendering game area
      const gameWidth = game.width;
      const gameHeight = game.height;
      const dHeight = main.displayHeight;
      const dWidth = main.displayWidth;
      const cursor = game.cursor;
      const entities = game.entities;
      // todo: link top left xy to specific panel
      // todo: 2-3 tile buffer before screen pan to avoid jerking camera
      //  via editing game 'cursor' object
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
      //display.draw(
      //  // when corner is out of bounds, topleft values go negative and center cursor
      //  player.x-topLeftX,
      //  player.y-topLeftY,
      //  player.char,
      //  //base+tone+joiner+rocket
      //  //'\u{1F468}\u{1f3fd}\u{200D}\u{1f680}',
      //  //'blue',
      //  //'green'
      //);
      // render entities
      let entity, eX, eY, eZ;
      for (let i=0; i < entities.length;i++) {
        entity = entities[i];
        eX = entity.x;
        eY = entity.y;
        eZ = entity.z;
        let tile = game.getTile(eX, eY);
        if (eX >= topLeftX && eY >= topLeftY
          && eX < topLeftX + dWidth
          && eY < topLeftY + dHeight){
          display.draw(
            eX - topLeftX,
            eY - topLeftY,
            entity.char,
            tile.fgColor,
            tile.bgColor
          );
        }
      }
    },
  },
}

////////////////////////////////////////////
APP_SETTINGS.appData = {
  // 38x20 lineheight fits in 320x320, smaller smartwatch res
  // todo: calc inflating font size to keep form factor
  startWidth: 38,
  startHeight: 20,
};

APP_SETTINGS.gameData = {
  worldData:  {
    depth:        6,
    currentDepth: 0,
    levels:       [],
    width:        60,
    height:       100,

  },
  glyphData: {

  },
  tileData:   {
    wall: {
      char: '\u{26F0}',//'
      fgColor: 'saddlebrown',
      bgColor: '#700000',
      destructible: true,
      passable: false,
      destroyed: 'floor',
    },
    floor: {
      char: '\`',
      fgColor: '#aa2222',
      bgColor: '#900000',
      passable: true,
    },
    none: {
      char: '\u{1F3D4}',
      fgColor: 'saddlebrown',
      bgColor: '#700000',
    }
  },

  playerData: {
    name: 'astro',
    char: '\u{1F468}\u{1f3fd}\u{200D}\u{1f680}',
    mobile: true,
    speed:  100,
  },

  entityData: {
    beastiary: {
      mushroom: {
        name: 'mushroom',
        char: '\u{1F344}',
        mobile: false,
        speed:  50,
        qty:  25,
      },
      seedling: {
        name: 'seedling',
        char: '\u{1F331}',
        mobile: false,
        speed:  0,
        qty: 20,
      }
    },
    levelData: {
      0: {
      mushroom: {
        qty: 3,
        },
      seedling: {
        qty: 4,
        }
      },
      1: {
        mushroom: {
          qty: 5,
          },
        seedling: {
          qty: 6,
          }
      },
        
    }
  }

}