var App = function() {
        this.CLIENT_ID = '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        this.SCOPES = 'https://www.googleapis.com/auth/drive';
        this.files = new Files;
        this.onGapiReady = this.files.onGapiReady;
        this.file = new File;
        this.currentKeyDownOffset;
    },
    p = App.prototype;

p.init = function(driveId) {
    this.files.init();
    this.file.init();
}