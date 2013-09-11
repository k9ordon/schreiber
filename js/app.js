var CLIENT_ID = '140224327941.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

var files = new Files;
files.init();

var file;

var googleapiready = files.onGapiReady;