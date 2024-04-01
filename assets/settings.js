//test
APP_SETTINGS.viewData = {
  splash: {
    name: "splash",
    fgColor: [
      "#990000",
      "#CC0000"
    ],
    bgColor: [
      "#330000",
      "#660000"
    ],
    colors: {
      fg1:  "#bdf",
      bg1:  "#002",
      accent1: "#ff8",
    },
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
      const main = this.main;
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
      const version = ' (v 0.1.0.4)';
      const display = view.display;
      const bgColor = '%b{' + this.colors('bg1') + '}';
      const fgColor = '%c{' + this.colors('fg1') + '}';
      const accentColor = '%c{' + this.colors('accent1') + '}';
      const colors1 = fgColor+bgColor;
      const colors2 = accentColor+bgColor;
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
        bannerY-2,
        colors2 + splitBanner[0]
      );
      display.drawText(
        bannerX+3,
        bannerY,
        colors2 + splitBanner[1]
      );
      display.drawText(
        bannerX+11,
        bannerY+2,
        colors1 + version
      );
      // draw prompt
      display.drawText(
        promptX,
        promptY,
        colors1 + prompt
      );
    }
  // end of splash
  },
  menu: {
    name: "menu",
    bgColor: '#700000',
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
    colors: {
      fg1:  "#bcf",
      bg1:  "#013",
      accent1: "#ff8",
    },
    load: function() {
      this.render(true);
    },
    render: function() {
      
      const main = this.main;
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
      bannerY = Math.floor(dHeight / 3);// ;//- 2;
      promptX = Math.floor(dWidth / 2) - Math.floor(prompt.length / 2);
      promptY = bannerY + 6;
      // colorize
      banner =
        '%c{' + this.colors('accent1') + '}' +
        '%b{' + this.colors('bg1') + '}' +
        banner;
      prompt =
        '%c{' + this.colors('fg1') + '}' +
        '%b{' + this.colors('bg1') + '}' +
        prompt;
      // render
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
    },
  // end of menu
  },
  play: {
    name: "play",
    bgColor: '#700000',
    colors: {
      titleFg:  '#2be',
      titleBg:  '#345',
      fg1:  "#09c",
      bg1:  "#123",
      bg1a:  "#112",
      bg1b: "#111",
      fg2: '#eee',
      bg2: '#058',
      accent1: "#ff8",
    },
    inputs: {
      enter:  function(main) {
        //idle
        const game = main.view.state;
        main.view.render();
        if (game.player.hp >= 0) {
          game.engine.unlock();
        }
        console.log('pass');
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
        //corners:  ['*','*','\\','\/'], // made more sense in non-square ratios
        origin: {
          x: 0,
          y: 0
        },
        //bodyWidth:  26,
        //bodyHeight:  24,
        render: function() {
          const view = this.view;
          const main = view.main;
          const display = view.display;
          //const game = view.state;
          //const main = view.main;
          // rendering game area
          const width = this.width;
          const origin = this.origin;
          const offset = Math.floor(this.title.length/2)
          // assumes even width

          const bgColorStr = '%b{' + view.colors('titleBg') + '}';
          const fgBgColorStr = '%c{' + view.colors('titleBg') + '}';
          const fgColorStr = '%c{' + view.colors('titleFg') + '}';
          let filler = bgColorStr + fgBgColorStr + '-'.repeat(
            Math.floor(width/2 - this.title.length/2));
          filler += fgColorStr + bgColorStr + this.title + filler;
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, filler);
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
      stage: {
        name: "stage",
        order:  1,
        origin: {
          x: 10,
          y: 1
        },
        //boarderWidth:  0,
        bodyWidth:  16,
        bodyHeight:  16,
        inputs: {
        },
        render: function() {
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
                char = ' ';
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
        },
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
        bodyWidth:  10,
        bodyHeight:  9,
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
          let bgHex = view.colors('bg1');
          let bg = '%b{' + bgHex + '}';
          let fgHex = view.colors('fg1');
          let fgBg = '%c{' + bgHex + '}';
          let fg = '%c{' + fgHex + '}';
          let accent = '%c{' + view.colors('accent1') + '}';
          let filler = bg + fgBg + '.'.repeat(width-1);
          const name = accent + bg + player.name;
          let hp = (player.hp > 0) ? player.hp : 0;
          let power = player.power;
          // so many hacks
          // todo: proper title rendering for panels
          // drawing right border on redraw to overwrite emoji overlap
          for (let i = 0; i < height; i++) {
            display.draw(
              origin.x + width-1,
              origin.y + i,
              '.',
              bgHex,
              bgHex
            );
          }
          display.drawText(origin.x, origin.y, filler, this.width);
          display.drawText(origin.x + 2, origin.y, name);
          display.draw(origin.x, origin.y, player.char, fg, view.colors('bg1'));
          display.drawText(origin.x, origin.y + 1,
            fg + bg + `Hungry`
          );

          // HP status line
          // Todo: break off main window paint from refreshing hp line
          display.draw(
            origin.x,
            origin.y + 3,
            '\u{2764}\u{FE0F}',
            null,
            bgHex
          );

          //if (hp < 10) {
          //  hp = "0" + hp + "/" + player.maxHp.toString();
          //} else {
          //  hp = hp.toString() + "/" + player.maxHp.toString();
          //}
          hp = player.hp;
          if (hp < 0) {
            hp = 0;
          }
          if (hp < 10) {
            hp = '0' + hp;
          }
          currentHp = hp.toString() + "/" + player.maxHp.toString();
          

          let colors = fg + bg;

          display.drawText(
            origin.x + 2,
            origin.y + 3,
            colors + currentHp,
          );

          // Energy status lline
          display.draw(
            origin.x,
            origin.y + 4,
            '\u{26A1}',
            null,
            bgHex
          );

          display.drawText(
            origin.x + 2,
            origin.y + 4,
            colors + '0'
          );

          // Atk Power
          display.draw(
            origin.x,
            origin.y + 5,
            '\u{1F4AA}',
            null,
            bgHex
          );

          display.drawText(
            origin.x + 2,
            origin.y + 5,
            colors + player.atkPower
          );

          // Defense
          display.draw(
            origin.x,
            origin.y + 6,
            '\u{1F6E1}\u{FE0F}',
            null,
            bgHex
          );
          
          display.drawText(
            origin.x + 2,
            origin.y + 6,
            colors + '0'
          );

          // Toolbox
          display.draw(
            origin.x,
            origin.y + 7,
            '\u{1F9F0}',
            null,
            bgHex
          );

          display.drawText(
            origin.x + 2,
            origin.y + 7,
            colors + 'None'
          );

          //// Backpack
          //display.draw(
          //  origin.x,
          //  origin.y + 8,
          //  '\u{1F392}',
          //  null,
          //  bgHex
          //);
//
          //display.drawText(
          //  origin.x + 2,
          //  origin.y + 8,
          //  colors + 'None'
          //);
          //display.drawText(origin.x, origin.y + 3,
          //  fg + bg + `HP:${hp}\/${player.maxHp}`
          //);
          //display.drawText(origin.x, origin.y + 4,
          //  fg + bg + `Power:100`
          //);
          //display.drawText(origin.x, origin.y + 5,
          //  fg + bg + `Attack:${player.atkPower}`
          //);
          //display.drawText(origin.x, origin.y + 6,
          //  fg + bg + `Defense:${player.defense}`
          //);
          //display.drawText(origin.x, origin.y + 7,
          //  fg + bg + `Eqp.:`
          //);
          
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
        bodyWidth:  10,
        bodyHeight:  7,
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
          let bgHex = view.colors('bg1a');
          let bg = '%b{' + bgHex + '}';
          let titleBg = '%b{' + view.colors('titleBg') + '}';
          let titleFgBg = '%c{' + view.colors('titleBg') + '}';
          let fg = '%c{' + view.colors('fg1') + '}';
          let titleFg = '%c{' + view.colors('titleFg') + '}';
          let filler = '-'.repeat(this.width);
          titleFill = 
            '%b{' + view.colors('titleBg') + '}' +
            '%c{' + view.colors('titleBg') + '}';
          panelFill =
          '%b{' + view.colors('bg1a') + '}' +
          '%c{' + view.colors('bg1a') + '}';
          let name = titleFg + titleBg + 'Info';
          // so many hacks
          // todo: proper title rendering for panels
          // drawing right border on redraw to overwrite emoji overlap
          // NOTE: draw, not drawText, seems to overwrite the pixel data
          let thisX = origin.x + width - 1;
          let thisY;
          let panelFiller = panelFill + filler;
          for (let i = 0; i < height; i++) {
            thisY = origin.y + i;
            display.draw(
              thisX,
              thisY,
              '.',
              bgHex,
              bgHex
            );
            display.drawText(
              origin.x,
              thisY,
              panelFiller
            )
          }
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, titleFill + filler, this.width);
          display.drawText(origin.x + Math.floor((this.width)/2-2), origin.y, name);
          //display.draw(origin.x, origin.y, player.char, null, bg);
          display.drawText(origin.x, origin.y + 2,
            fg + bg + 'Exit:'
          );
          let exit = game.stage.mainExit;
          if (!exit) {
            exit = game.stage.mainEntrance;
          }
          let remaining = Math.round(player.getDistance(exit)*10);
          display.drawText(origin.x + 6, origin.y + 2,
            '%c{white}' + bg + remaining + 
            fg + bg + 'm'
          );
        }
      // end of sidebar2
      },
      log: {
        name: "log",
        title: "Messages",
        order:  4,
        borderWidth: 1,
        corners:  ['*','*','\\','\/'],
        origin: {
          x: 0,
          y: 17
        },
        bodyWidth:  26,
        bodyHeight:  9,
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

          let bgColorStr = '%b{' + view.colors('bg1b') + '}';
          let fgBgColorStr = '%c{' + view.colors('bg1b') + '}';
          let fgColorStr = '%c{' + view.colors('fg1') + '}';
          msgBg = '%b{' + view.colors('bg1a') + '}';

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
          bgColorStr = '%b{' + view.colors('titleBg') + '}';
          fgBgColorStr = '%c{' + view.colors('titleBg') + '}';
          fgColorStr = '%c{' + view.colors('titleFg') + '}';
          filler = bgColorStr + fgBgColorStr + '-'.repeat(
            Math.floor((this.width)/2 - this.title.length/2));
          filler += fgColorStr + bgColorStr + this.title + filler;
          // so many hacks
          // todo: proper title rendering for panels
          display.drawText(origin.x, origin.y, filler, this.width+2);
        }
        
      // end of messages
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
  startHeight: 26,
  fontSize: 16,
  fontFamily: 'Silkscreen',
  spacing: 1,
// end of appData
};

APP_SETTINGS.gameData = {
  worldData:  {
    width:        38,
    height:       38,
    depth:        3,
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
    fgColor:  '#ff8',
    mobile: true,
    speed:  100,
    defense: 0,
    strength: 3,
    energy: 0,
    maxHp:  99,
    sightRadius:  9,
  },

  entityData: {
    bestiary: {
      mushroom: {
        name: 'mushroom',
        char: '\u{1F344}',
        fgColor: '#dda',
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
        strength: 1,
        fgColor: '#aad',
        target: true,
        maxHp: 4,
        sightRadius:  7,
        intel:  2,        
      },
      robot: {
        name: 'Robot',
        char: '\u{1F916}',
        fgColor: '#ddd',
        mobile: true,
        speed:  50,
        strength: 5,       
        defense: 10,
        target: true,
        maxHp: 15,
        defense:  75,
        sightRadius:  5,
        intel:  7,
      },
      zombie: {
        name: 'Zombie',
        char: '\u{1F9DF}',
        fgColor:  '#5f5',
        mobile: true,
        speed:  50,
        strength: 3,
        target: true,
        maxHp: 6,
        defense:  5,
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