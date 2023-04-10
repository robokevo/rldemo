document.addEventListener("DOMContentLoaded", function() {
  // todo: Compatibility test
  // 'ROT.isSupported()' from cctut01 deprecated

  // fwiw 'let' support should be a pretty decent test of how modern a browser is
  let supported = true;
  
  if (supported){
    // initializing new ROT display object
    // todo: read window size/media queries
    let display = new ROT.Display({width:80,height:20});
    let container = document.getElementById('app');
    container.appendChild(display.getContainer());
    console.log(container);
  
    let foreground, background, colors;
    for (var i = 0; i < 15; i++) {
      foreground = ROT.Color.toRGB([
        255 - (i*20),
        255 - (i*20),
        255 - (i*20)]);
      background = ROT.Color.toRGB([i*20,i*20,i*20]);
      // color format specifier
      colors = "%c{" + foreground + "}%b{" + background + "}";
      console.log(colors);
      // draw text two columns in and at row 'i'
      display.drawText(2, i, colors + "Hell0 w0rld!~");
    }
  
  } else {
    alert('Please use Firefox or a Chromium-based browser');
  }
});