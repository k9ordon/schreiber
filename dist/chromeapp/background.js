/*! schreiberapp - v0.0.2 - last build: 2013-10-09 19:57:57 */
console.log('chrome init');

chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 500;
  var height = 500;

  chrome.app.window.create('index.html', {
    id: 'main',
    frame: 'none', 
    minWidth: 320,
    bounds: {
        width: width,
        height: height,
        left: Math.round((screenWidth-width)/2),
        top: Math.round((screenHeight-height)/2)
    }
  });
});