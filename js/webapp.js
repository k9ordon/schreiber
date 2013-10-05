var app = new App,
    p = null,
    gapiIsLoaded = app.onGapiReady;

app.init();

var script = document.createElement('script');
script.src = 'https://apis.google.com/js/client.js?onload=gapiIsLoaded';
document.documentElement.appendChild(script);

/*
window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
*/