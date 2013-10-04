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
    var params = {};

    
    if (!(chrome && chrome.app && chrome.app.runtime)) {
        params.client_id = app.CLIENT_ID;
        params.scope = app.SCOPES; 
    }

    params.immediate = true;
    gapi.auth.authorize(params, 
        function(auth) {
            console.log(1, auth);
            if(auth != null) {
                app.googledrive.onAuthorizeReady(auth); 
                return;
            }

            params.immediate = false;
            gapi.auth.authorize(params,
                function(auth) {
                    console.log(2);
                    if(auth) {
                        app.googledrive.onAuthorizeReady(auth); 
                        return;
                    }
                    alert('oauth error => offline mode');
                }       
            );
        }       
    );
};

p.onAuthorizeReady = function(auth) {
    console.log('auth ready ', auth);
    console.log('logout url: ', 'https://accounts.google.com/o/oauth2/revoke?token=' + auth.access_token);

    // @todo redirect to login page || boot app

    app.show();
    //app.titlebar.loadUserbadge();
    app.fileBrowser.getDriveFiles();
}

p.getUsername = function() {
    var request = gapi.client.request({
        'path': 'drive/v2/files',
        'method': 'GET',
        'params': {
            'maxResults': 950,
            'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
            //'q': "mimeType contains 'text' and writers"
            //'q': "title contains 'meeting'"
        },
        'callback': app.fileBrowser.onDriveFilesReady
    });
    //request.execute(app.fileBrowser.onDriveFilesReady);
}