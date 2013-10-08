var App = function() {
        // loading spinner
        this.bigSpinnerOpts = {
          lines: 15, length: 5, width: 1, radius: 10, color: '#657b83'
        };
        this.smallSpinnerOpts = {
          lines: 9, length: 3, width: 1, radius: 4, color: '#657b83'
        };
        var spinnerLoading = new Spinner(this.smallSpinnerOpts).spin(document.querySelector('#spinner'));


        this.$el = document.querySelector('#app');
        this.$loading = document.querySelector('#loading');

        var o = window.location.origin;
        
        if(o === "http://schreiber-dev.k94n.com")
            this.CLIENT_ID = '140224327941.apps.googleusercontent.com';
        else if(o === "http://schreiber.k94n.com")
            this.CLIENT_ID = '140224327941-66s2fenc5nlln3shi4r1b04ho2jvgerr.apps.googleusercontent.com';
        else if(o === "chrome-extension://fmgcelokejjmhifoocmnpmmklnaigiph")
            this.CLIENT_ID = '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        else if(o === "file://")
            this.CLIENT_ID = '140224327941-553f7v0a14p71ute2ogtrm1anbcsmhcl.apps.googleusercontent.com';
        else
            alert('no valid api key for ' + o);

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
    this.titlebar.init();
    this.fileBrowser.init();

    this.openFile(null, 'welcome.md', 'yoyo');
    this.events();
}

p.show = function() {
    this.$el.classList.remove('hidden');
    this.$loading.classList.add('hidden');
}

p.openFile = function(driveId, title, text) {
    app.file = new File;
    
    app.files.push(app.file);
    app.file.init(driveId, title, text);
}

p.events = function() {
    Mousetrap.bindGlobal('command+s', function(e) {
        console.log('save');
        alert('save ...');
        //e.preventDefault();
        return false;
    });

    Mousetrap.bindGlobal('command+p', function(e) {
        app.showPreview();
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

p.showPreview = function() {
    console.log('show Preview');

    if(document.body.classList.contains('preview')) {
        app.hidePreview();
        return true;
    }

    document.body.classList.add('preview');
}

p.hidePreview = function() {
    console.log('hide Preview');
    document.body.classList.remove('preview');
}

p.showDocuments = function() {
    console.log('show Documents');
}