(function() {
  var _this = this;

  console.log('chrome background init');

  chrome.app.runtime.onLaunched.addListener(function() {
    var height, screenHeight, screenWidth, width;
    screenWidth = screen.availWidth;
    screenHeight = screen.availHeight;
    width = 500;
    height = 500;
    return chrome.app.window.create('index.html', {
      id: 'main',
      frame: 'none',
      bounds: {
        width: width,
        height: height,
        left: Math.round((screenWidth - width) / 2),
        top: Math.round((screenHeight - height) / 2)
      }
    });
  });

}).call(this);

/*
//@ sourceMappingURL=background.js.map
*/