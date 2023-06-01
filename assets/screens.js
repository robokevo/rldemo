
APP_SETTINGS.viewData = {
  splash: {
    name: "Splash",
    inputs: {
      enter:  function(main) {
        main.changeView("menu");
      },
      t:  (main)=> console.log('toops'),
    },
    load: function() {
      console.log(this.main._logic);
    },
    render: function() {
      display = this.main.display;
      console.log(display);
    }
  },
  menu: {
    name: "Menu",
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
  },
  play: {
    name: "Play",
    inputs: {
      enter:  function() {
          console.log("pressed Enter in Play");
        },
      escape:  function(main) {
          console.log("pressed Escape in Play");        
          main.changeView("menu");
        },
      m:  function(main) {
        console.log(main.game);
      },
      M:  function(main){
        console.log('emmm');
      },
    },
    load: function(){
      this.main._logic = 5;
    }
  },
}

