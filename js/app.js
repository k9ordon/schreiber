var App = function() {
        this.$el = document.querySelector('#app');

        var o = window.location.origin;
        
        if(o === "http://schreiber-dev.k94n.com")
            this.CLIENT_ID = '140224327941.apps.googleusercontent.com';
        else if(o === "http://schreiber.k94n.com")
            this.CLIENT_ID = '140224327941-66s2fenc5nlln3shi4r1b04ho2jvgerr.apps.googleusercontent.com';
        else if(o === "chrome-extension://fmgcelokejjmhifoocmnpmmklnaigiph")
            this.CLIENT_ID = '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        else
            alert('no valid api key');

        this.SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/userinfo.email'];
        this.googledrive = new Googledrive;
        this.onGapiReady = this.googledrive.init;
        this.titlebar = new Titlebar;
        this.fileBrowser = new FileBrowser;
        this.file = null; // current file
        this.files = [];
        this.currentFile
        this.currentKeyDownOffset;

        this.$titlebar = document.querySelector('.titlebar');
    },
    p = App.prototype;

p.init = function() {
    console.log('app init');
    this.fileBrowser.init();

    this.newFile();
    this.events();
}

p.show = function() {
    this.$el.classList.remove('hidden');
}

p.newFile = function() {
    app.file = new File;
    
    app.files.push(app.file);
    app.file.init();
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