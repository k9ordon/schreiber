var WindowControls = function() {
        this.$windowClose = document.querySelector('#windowClose');
        this.$windowMinimize = document.querySelector('#windowMinimize');
        this.$windowMaximize = document.querySelector('#windowMaximize');
    },
    p = WindowControls.prototype;

p.init = function() {
    console.log('windo init');
    this.events();
}

p.events = function() {
    Mousetrap.bindGlobal('command+w', this.windowClose);
    Mousetrap.bindGlobal('command+f', this.windowFullscreen);

    this.$windowClose.addEventListener('click', this.windowClose);
    this.$windowMinimize.addEventListener('click', this.windowMinimize);
    this.$windowMaximize.addEventListener('click', this.windowMaximize);
}

p.windowClose = function() {
    chrome.app.window.current().close();
}

p.windowMinimize = function() {
    chrome.app.window.current().minimize();
}

p.windowMaximize = function() {
    var cw = chrome.app.window.current();

    if(cw.isMaximized()) {
        cw.restore();
    } else {
        cw.maximize();
    }
}

p.windowFullscreen = function() {
    var cw = chrome.app.window.current();

    if(cw.isFullscreen()) {
        cw.restore();
    } else {
        cw.fullscreen();
    }
}