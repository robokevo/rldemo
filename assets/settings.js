
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
      const main = this.main; console.log(main);
      const view = main.view;
      const game = main.getState('play');
      let verb;
      if (game) {
        verb = 'continue';
      } else {
        verb = 'start';
      }
      let banner = 'M O O N  M I N E R Z Z';
      let prompt = 'Press [Enter] to ' + verb;
      // todo: version number var in game settings
      const version = ' (v 0.1.0.1)';
      const display = view.display;
      dWidth = main.displayWidth;
      dHeight = main.displayHeight;
      origin = this.origin;
      // draw banner
      //banner += version; console.log(banner);
      let bannerX, bannerY, promptX, promptY;
      bannerX = Math.floor(dWidth / 2) - Math.floor(banner.length / 2);
      bannerY = Math.floor(dHeight / 2) - 2;
      promptX = Math.floor(dWidth / 2) - Math.floor(prompt.length / 2);
      promptY = bannerY + 6;
      let splitBanner = banner.split("  "); console.log(splitBanner);
      display.drawText(
        bannerX,
        bannerY-1,
        splitBanner[0]
      );
      display.drawText(
        bannerX+3,
        bannerY,
        splitBanner[1]
      );
      display.drawText(
        bannerX+13,
        bannerY+1,
        version
      );
      // draw prompt
      display.drawText(
        promptX,
        promptY,
        prompt
      );
    }
  // end of splash
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
      
      const main = this.main; console.log(main);
      const view = main.view;
      const game = main.getState('play');
      let verb;
      if (game) {
        verb = 'continue';
      } else {
        console.log(game);
        verb = 'start';
      }
      let banner = 'Menu';
      let prompt = 'Press [Enter] to ' + verb;
      // todo: version number var in game settings
      const display = view.display;
      dWidth = main.displayWidth;
      dHeight = main.displayHeight;
      origin = this.origin;
      // draw banner
      //banner += version; console.log(banner);
      let bannerX, bannerY, promptX, promptY;
      bannerX = Math.floor(dWidth / 2) - Math.floor(banner.length / 2);
      bannerY = Math.floor(dHeight / 2) - 2;
      promptX = Math.floor(dWidth / 2) - Math.floor(prompt.length / 2);
      promptY = bannerY + 6;
      display.drawText(
        bannerX,
        bannerY,
        banner
      );
      // draw prompt
      display.drawText(
        promptX,
        promptY,
        prompt
      );
      console.log(test);
    },
  // end of menu
  },
  play: {
    name: "play",
    bgColor: '#700000',
    inputs: {
      enter:  function(main) {
        //idle
        const game = main.view.state;
        main.view.render();
        console.log('pass');
        game.engine.unlock();
      },
      escape:  function(main) {
        console.log("pressed Escape in Play");        
        main.changeView("menu");
      },
      arrowup: function(main) {
        const game = main.view.state;
        const player = game.player;
        const coord = player.coord;
        coord.y--;
        const result = player.tryPos(coord);
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      arrowdown: function(main) {
        const game = main.view.state;
        const player = game.player;
        const coord = player.coord;
        coord.y++;
        const result = player.tryPos(coord);
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      arrowleft: function(main) {
        const game = main.view.state;
        const player = game.player;
        const coord = player.coord;
        coord.x--;
        const result = player.tryPos(coord);
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      arrowright: function(main) {
        const game = main.view.state;
        const player = game.player;
        const coord = player.coord;
        coord.x++;
        const result = player.tryPos(coord);
        main.view.render();
        if (result) {
          game.engine.unlock();
        }
      },
      m:  function(main) {
        console.log(main);
      },
      t:  function(main) {
        const game = main.view.state;
        console.log(game.getTile(game.player));
      },
      x:  function(main) {
        const game = main.view.state;
        console.log(game.getRandom());
      },
      z:  function(main) {
        const game = main.view.state;
        const player = game.player;
        console.log(player);
        console.log(game);
      },
    },
    load: function() {
      if (!this.state) {
        // passing view into game object for easier rendering
        this.state = new Game(this.main.settings.gameData, this);
        game = this.state;
        game.makeWorld();
        game.loadScheduler();
        game.engine.start();
      } else {
        console.log(game);
      }
      game.unPause();
      this.render();
    },
    unload: function() {
      this.state.pause();
    },
    render: function() {
      // placeholder
    },
    panels: {
      main: {
        name: "main",
        title: "*Moon Minerzz*",
        order:  0,
        borderWidth: 1,
        corners:  ['*','*','\\','\/'],
        origin: {
          x: 0,
          y: 0
        },
        width:  26,
        height:  24,
        render: function() {
          const view = this.view;
          const main = view.main;
          const display = view.display;
          //const game = view.state;
          //const main = view.main;
          // rendering game area
          const dWidth = this.width;
          const origin = this.origin;
          const offset = Math.floor(this.title.length/2)
          // assumes even width

          const bgColorStr = '%b{' + this.bgColor + '}';
          const fgBgColorStr = '%c{' + this.bgColor + '}';
          const fgColorStr = '%c{' + '#ffbbbb' + '}';
          let filler = bgColorStr + fgBgColorStr + '-'.repeat(
            Math.floor((this.width-2)/2 - this.title.length/2));
          filler += fgColorStr + bgColorStr + this.title + filler;
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x + 1, origin.y, filler);
          ////const title = this.corners[0] + bgColorStr + filler + fgColorStr + this.corners[1];
          ////const filler = fgColorStr + bgColorStr + '_'.repeat(this.width-1);
          //display.drawText(origin.x, origin.y, filler);
          ////const title = this.corners[0] + bgColorStr + filler + fgColorStr + this.corners[1];
          //display.draw(origin.x, origin.y, this.corners[0], '#ee7777', this.bgColor);
          //display.draw(this.width - 2, origin.y, this.corners[1], '#ee7777', this.bgColor);
          //display.draw(
          //  Math.floor(this.width/2 - 1 - this.title.length/2),
          //  origin.y, this.title, '#ffbbbb', this.bgColor);
        },
      },
      log: {
        name: "log",
        title: "Messages",
        order:  1,
        borderWidth: 1,
        corners:  ['*','*','\\','\/'],
        origin: {
          x: 0,
          y: 17
        },
        width:  26,
        height:  9,
        render: function() {
          const view = this.view;
          const display = view.display;
          const game = view.state;
          const player = game.player;
          //const game = view.state;
          //const main = view.main;
          // rendering game area
          const dWidth = this.width;
          const origin = this.origin;
          const offset = Math.floor(this.title.length/2)
          // assumes even width


        
          // Rendering messages from the line under the heading
          // messages render with the most recent message at the top,
          // pushing subsequent messages down the screen

          const messages = player.messages;

          let bgColorStr = '%b{' + '#330000' + '}';
          let fgBgColorStr = '%c{' + '#220000' + '}';
          let fgColorStr = '%c{' + '#ffaaaa' + '}';
          msgBg = '%b{' + '#220000' + '}';

          let row = origin.y + 1;
          let overflow = 0;
          let message = fgColorStr + msgBg;
          
          let filler = bgColorStr + fgBgColorStr + '. '.repeat(Math.ceil(this.width/2));

          for (let f = 1; f < this.height; f++) {
            display.drawText(origin.x, origin.y + f, filler, this.width);
          }

          if (messages.length > 0) {
            for (let i = 0; i < this.height; i++) {
              if (messages[messages.length-(1+i)]) {
                display.drawText(origin.x, row, filler, this.width);
                overflow = display.drawText(origin.x, row, message + messages[messages.length-(1+i)]);
                row += overflow;
              } 
            }
          }
          // rendering heading
          bgColorStr = '%b{' + '#992222' + '}';
          fgBgColorStr = '%c{' + '#992222' + '}';
          fgColorStr = '%c{' + '#ff9999' + '}';
          filler = bgColorStr + fgBgColorStr + '-'.repeat(
            Math.floor((this.width)/2 - this.title.length/2));
          filler += fgColorStr + bgColorStr + this.title + filler;
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, filler, this.width+2);
        }
        
      // end of messages
      },
      sidebar1: {
        name: "Player",
        order:  2,
        origin: {
          x: 0,
          y: 1,
        },
        inputs: {
        },
        width:  9,
        height:  16,
        render: function() {
          const view = this.view;
          const display = view.display;
          const game = view.state;
          const player = game.player;
          const origin = this.origin;
          const width = this.width;
          const height = this.height;
          // assumes even width

          // rendering heading
          let bg = '%b{' + '#992222' + '}';
          let fgBg = '%c{' + '#992222' + '}';
          let fg = '%c{' + '#ffbbbb' + '}';
          let filler = bg + fgBg + '.'.repeat(this.width);
          const name = fg + bg + player.name;
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, filler, this.width);
          display.drawText(origin.x + 2, origin.y, name);
          display.draw(origin.x, origin.y, player.char, '#992222', '#992222');
          display.drawText(origin.x, origin.y + 1,
            fg + '%b{' + view.bgColor + '}' + `Hungry`
          );
          display.drawText(origin.x, origin.y + 3,
            fg + '%b{' + view.bgColor + '}' + `HP:${player.hp}\/${player.maxHp}`
          );
          display.drawText(origin.x, origin.y + 4,
            fg + '%b{' + view.bgColor + '}' + `Energy:100`
          );
          display.drawText(origin.x, origin.y + 5,
            fg + '%b{' + view.bgColor + '}' + `Attack:${player.atkPower}`
          );
          display.drawText(origin.x, origin.y + 6,
            fg + '%b{' + view.bgColor + '}' + `Defense:${player.defense}`
          );
          display.drawText(origin.x, origin.y + 7,
            fg + '%b{' + view.bgColor + '}' + `Eqp.:`
          );

        }
      // end of sidebar1
      },
      sidebar2: {
        name: "Info",
        order:  3,
        origin: {
          x: 0,
          y: 10,
        },
        inputs: {
        },
        width:  9,
        height:  16,
        render: function() {
          const view = this.view;
          const display = view.display;
          const game = view.state;
          const player = game.player;
          const origin = this.origin;
          const width = this.width;
          const height = this.height;
          // assumes even width

          // rendering heading
          let bg = '%b{' + '#992222' + '}';
          let fgBg = '%c{' + '#992222' + '}';
          let fg = '%c{' + '#ff9999' + '}';
          let filler = bg + fgBg + '-'.repeat(this.width);
          let name = fg + bg + 'Info';
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, filler, this.width);
          display.drawText(origin.x + Math.floor((this.width)/2-2), origin.y, name);
          //display.draw(origin.x, origin.y, player.char, null, bg);
          display.drawText(origin.x, origin.y + 2,
            fg + '%b{' + view.bgColor + '}' + 'No Info'
          );
        }
      // end of sidebar2
      },
      stage: {
        name: "stage",
        order:  0,
        origin: {
          x: 10,
          y: 1
        },
        boarderWidth:  0,
        width:  16,
        height:  16,
        inputs: {
        },
        render: function() {
          //  tile.lastKnown = tile.char;
          const view = this.view;
          const display = view.display;
          const game = view.state;
          const player = game.player;
          const stage = game.stage;
          // const main = view.main;
          // rendering game area
          const dHeight = this.height;
          const dWidth = this.width;
          const cursor = game.cursor;
          const origin = this.origin;
          const entities = game.entities();
          // todo: link top left xy to specific panel
          // todo: 2-3 tile buffer before screen pan to avoid jerking camera
          //  via editing game 'cursor' object
          // to bind player view to stage, use the following:
          // let topLeftX = Math.max(0, cursor.x - (dWidth/2));
          // let topLeftY = Math.max(0, cursor.y - (dHeight/2));
          const topLeftX = cursor.x - (dWidth/2);
          const topLeftY = cursor.y - (dHeight/2);
          const seen = {};
          stage.fov.compute(
            player.x,
            player.y,
            player.sightRadius,
            (x, y, radius, visibility ) => {
              //todo: implement known with grid if perf is better
              seen[x+','+y] = true;
            }); // todo: wtf does visibility do
          // iterating through map tiles and rendering
          // todo: concat a row of glyphs and call drawText instead of individual calls
          let fgColor, bgColor, char, known;
          for (let x = topLeftX; x < topLeftX + dWidth; x++) {
            for (let y = topLeftY; y < topLeftY + dHeight; y++) {
              let tile = stage.getTile({x:x,y:y,});
              known = player.getKnown(x, y);
              if (!tile) {
                tile = game.noTile;
              }
              if (seen[x+','+y]) {
                player.setKnown(tile);
                fgColor = stage.fgColor[0];
                bgColor = stage.fgColor[1];
                char = tile.char;
              } else if (known !== false) {
                char = known;
                fgColor = stage.bgColor[0];
                bgColor = stage.bgColor[1];
              } else {
                char = '.';
                fgColor = stage.bgColor[0];
                bgColor = stage.bgColor[1];
              }
              display.draw(
              origin.x + x - topLeftX,
              origin.y + y - topLeftY,
              char,
              fgColor,
              bgColor
              );
            }
          }
          // render entities
          let entity, eX, eY;
          for (let i=0; i < entities.length;i++) {
            entity = entities[i];
            //if (entity!==player) {
              eX = entity.x;
              eY = entity.y;
              eZ = entity.z;
              // todo: save tile colors on entity's first move, show as defaults
              let tile = game.getTile(entity);
              if (eX >= topLeftX && eY >= topLeftY
                && eX < topLeftX + dWidth
                && eY < topLeftY + dHeight
                && seen[eX+','+eY]){
                display.drawOver(
                  origin.x + eX - topLeftX,
                  origin.y + eY - topLeftY,
                  entity.char,
                  null,//tile.fgColor,
                  null//tile.bgColor
                );
              }
            //}
          }
          // render over left boarder to hide overhang of large emoji
          let filler = '-';
          fg = this.fgColor;
          bg = this.bgColor;
          for (let i = 0; i < this.height; i++) {
            display.draw(
              origin.x-1,
              origin.y + i,
              filler,
              bg,
              bg
            )
          }
        },
      },
    // end of panels
    },
  // end of play screen
  },
// end of viewData
}


//////////////////////////////////////////
// World and entity settings

APP_SETTINGS.appData = {
  startWidth: 26,
  startHeight: 24,
// end of appData
};

APP_SETTINGS.gameData = {
  worldData:  {
    depth:        6,
    currentDepth: 0,
    stageData:       {
      0: {
        fgColor: [
          "#990000",
          "#CC0000"
        ],
        bgColor: [
          "#330000",
          "#660000"
        ]
      },
      1: {        
        fgColor: [
          "#994C00",
          "#CC6600"
        ],
        bgColor: [
          "#331900",
          "#663300"
        ]
      },
      2: {        
        fgColor: [
          "#999900",
          "#CCCC00"
        ],
        bgColor: [
          "#333300",
          "#666600"
        ]
      },
      3: {        
        fgColor: [
          "#4C9900",
          "#66CC00"
        ],
        bgColor: [
          "#193300",
          "#336600"
        ]
      },
      4: {        
        fgColor: [
          "#009900",
          "#00CC00"
        ],
        bgColor: [
          "#003300",
          "#006600"
        ]
      },
      5: {        
        fgColor: [
          "#4C0099",
          "#6600CC"
        ],
        bgColor: [
          "#190033",
          "#330066"
        ]
      },
    },
    width:        48,
    height:       30,
  // end of worldData
  },
  glyphData: {

  },
  tileData:   {
    wall: {
      //boulder doesn't work in chromium windows as of 8/23
      //char: '\u{1FAA8}',
      char: '\u{26F0}', // add '\u{FE0F}' for emoji style
      fgColor: 'saddlebrown',
      bgColor: '#700000',
      destructible: true,
      passable: false,
      destroyed: 'floor',
      region: 0,
    },
    floor: {
      char: '\`',
      fgColor: '#aa2222',
      bgColor: '#900000',
      passable: true,
      transparent: true,
    },
    none: {
      char: '\u{1F3D4}',
      fgColor: 'saddlebrown',
      bgColor: '#700000',
    },
    hole: {
      char: '\u{1F573}',
      fgColor: '#242222',
      bgColor: '#990000',
      passable: true,
      exit: true,
      // todo: straighten out directionality
      direction: 'down',
      transparent:  true,
    },
    ladder: {
      char: '\u{1FA9C}',
      fgColor: '#aa2222',
      bgColor: '#900000',
      passable: true,
      exit: true,
      direction: 'up',
      transparent:  true,
    }
  // end of tileData
  },

  playerData: {
    name: 'Astraux',
    char: '\u{1F468}\u{1f3fd}\u{200D}\u{1f680}',
    mobile: true,
    speed:  100,
    basePower: 3,
    maxHp:  99,
    sightRadius:  5,
  },

  entityData: {
    bestiary: {
      mushroom: {
        name: 'mushroom',
        char: '\u{1F344}',
        mobile: false,
        target: true,
        speed:  25,
        hp: 2,
        spreader: true,
        spreadRate: .02,
        spreadRange: 1,
        offspring:  1,
        hearing:  false,
      },
      bat: {
        name: 'Bat',
        char: '\u{1F987}',
        mobile: true,
        speed:  175,
        fgColor: 'white',
        target: true,
        maxHp: 4,
        sightRadius:  7,
        intel:  2,        
      },
      robot: {
        name: 'Robot',
        char: '\u{1F916}',
        mobile: true,
        speed:  50,
        fgColor: 'white',
        target: true,
        maxHp: 15,
        baseDefense:  75,
        sightRadius:  5,
        intel:  7,
      },
      zombie: {
        name: 'Zombie',
        char: '\u{1F9DF}',
        mobile: true,
        speed:  50,
        fgColor: 'white',
        target: true,
        maxHp: 6,
        baseDefense:  5,
        sightRadius:  6,
        intel:  5,
      },
    // end of bestiary
    },
    stageData: {
      0: {
        mushroom: {
          qty: 15,
        },
        bat: {
          qty: 17,
        },
        robot: {
          qty: 13,
        },
        zombie: {
          qty: 14,
        }
      },
      1: {
        mushroom: {
          qty: 15,
        },
        bat: {
          qty: 17,
        },
        robot: {
          qty: 14,
        },
        zombie: {
          qty: 15,
        }
      },
      2: {
        mushroom: {
          qty: 15,
        },
        bat: {
          qty: 17,
        },
        robot: {
          qty: 17,
        },
        zombie: {
          qty: 18,
        }
      },
      3: {
        mushroom: {
          qty: 14,
        },
        bat: {
          qty: 17,
        },
        robot: {
          qty: 18,
        },
        zombie: {
          qty: 19,
        }
      },
      4: {
        mushroom: {
          qty: 15,
        },
        bat: {
          qty: 18,
        },
        robot: {
          qty: 20,
        },
        zombie: {
          qty: 20,
        }
      },
      5: {
        mushroom: {
          qty: 25,
        },
        bat: {
          qty: 25,
        },
        robot: {
          qty: 22,
        },
        zombie: {
          qty: 22,
        }
      }
    // end of stage data
    }
  // end of entity data
  }
// end of game data
}