// todo: a screen class with inherent methods for entering, exiting, etc.
APP_SETTINGS.screenList = {
  splash: {
    name: "Splash",
    inputs: {
      Enter:  function(main) {
        console.log("pressed Enter in Splash");
        main.screen.switch("menu");
      }
    }
  },
  menu: {
    name: "Menu",
    inputs: {
      Enter:  function() {
        console.log("pressed Enter in Menu");
      },
      Escape:  function(main) {
        console.log("pressed Escape in Menu");        
        main.screen.switch("splash");
      }
    },
  play:"",
  }
};

/*APP_SETTINGS.screens.playScreen = {
  enter:  function() {
    console.log("Entered play screen");
  },
  exit: function() {
    console.log("Exited play screen");
  },
  render: function(display) {
    // renders prompt to screen
    display.drawText(1,1, "Press [Enter] againe");
  },
  handleInput:  function(){
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        mainApp.switchScreen(mainApp._screens.startScreen);
      } else {
        console.log('?');
      }
    }
  }
}
*/
