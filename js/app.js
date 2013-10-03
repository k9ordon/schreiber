var App = function() {
        this.CLIENT_ID = '140224327941.apps.googleusercontent.com';//'140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        this.SCOPES = 'https://www.googleapis.com/auth/drive';
        this.fileBrowser = new FileBrowser;
        this.onGapiReady = this.fileBrowser.onGapiReady;

        this.currentFiles = [],

        this.file = new File;
        this.preview = new Preview;
        this.currentKeyDownOffset;

        this.$titlebar = document.querySelector('.titlebar');
    },
    p = App.prototype;

p.init = function() {
    this.fileBrowser.init();
    this.file.init();
    this.preview.init();

    this.events();
}

p.events = function() {
    this.$titlebar.addEventListener('mouseover', function(){
        console.log('mouseover');
        app.setDistractionFree(false);
    });

    Mousetrap.bindGlobal('command+s', function(e) {
        console.log('save');
        //e.preventDefault();
        return false;
    });
}

p.setDistractionFree = function(bool) {
    if(bool === true) {
        document.body.classList.add('distractionFree');
        return;
    }
    document.body.classList.remove('distractionFree');
}