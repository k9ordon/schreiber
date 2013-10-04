var Googledrive = function() {
        this.CLIENT_ID = '140224327941.apps.googleusercontent.com';//'140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        this.SCOPES = 'https://www.googleapis.com/auth/drive';
    },
    p = Googledrive.prototype;

p.init = function() {
    console.log('googleDrive init');
    app.googledrive.authorize();
}

p.authorize = function() {
    gapi.auth.authorize({
            'client_id': app.CLIENT_ID, 
            'scope': app.SCOPES, 
            'immediate': true
            //'approvalprompt': 'force'
        },
        function(auth) {
            console.log('auth ready ', auth);

            // @todo redirect to login page || boot app

            app.show();
            app.titlebar.getUsername();
            app.fileBrowser.getDriveFiles();
        }       
    );
};

p.getUsername = function() {
    var request = gapi.client.request({
        'path': 'drive/v2/files',
        'method': 'GET',
        'params': {
            'maxResults': 950,
            'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
            //'q': "mimeType contains 'text' and writers"
            //'q': "title contains 'meeting'"
        }
    });
    request.execute(app.fileBrowser.onDriveFilesReady);
}