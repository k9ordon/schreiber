(function() {
  var receiveMessage,
    _this = this;

  document.body.style.background = 'red';

  receiveMessage = function(e, msg) {
    window.appWindow = event.source;
    window.appOrigin = event.origin;
    console.log('receiveMessage', e, window.appWindow, window.appOrigin);
    return appWindow.postMessage({
      location: window.location.href
    }, appOrigin);
  };

  window.addEventListener('message', receiveMessage);

  console.log('init');

}).call(this);

/*
//@ sourceMappingURL=chromewebview.js.map
*/