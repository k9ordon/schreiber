var CLIENT_ID = '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

var files = new Files;
files.init();
 
var file = new File();
file.init();

var gapiIsLoaded = files.onGapiReady;