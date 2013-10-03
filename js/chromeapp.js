var app = new App,
    gapiIsLoaded = app.onGapiReady,
    p = null,
    windowControls = new WindowControls;

document.addEventListener('DOMContentLoaded', function(e) {
    app.init();
    windowControls.init();
});