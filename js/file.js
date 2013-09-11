var File = function() {
		this.$el = document.querySelector('#file');
		this.$src = this.$el.querySelector('#src');
		this.driveId = null;
	},
	p = File.prototype;

p.init = function(driveId) {
	console.log('File init');
	this.driveId = driveId;
	
	this.loadDriveFile();

	return this;
};

p.loadDriveFile = function() {
	var request = gapi.client.request({
		'path': 'drive/v2/files/' + this.driveId,
		'method': 'GET',
		'params': {
			//'maxResults': 100,
			//'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
			//'q': "mimeType contains 'text' and writers"
			//'q': "title contains 'meeting'"
		}
	});
	request.execute(file.onDriveFileInfoReady);
}

p.onDriveFileInfoReady = function(resp) {
	console.log('onDriveFileReady', resp);

	var driveToken = gapi.auth.getToken(),
    	driveFileXhr   = new XMLHttpRequest();

    driveFileXhr.open('GET', resp.downloadUrl, true);
    driveFileXhr.setRequestHeader('Authorization', 'Bearer ' + driveToken.access_token );

    driveFileXhr.onreadystatechange = function( theProgressEvent ) {
        if (driveFileXhr.readyState == 4) {
//          1=connection ok, 2=Request received, 3=running, 4=terminated
            if ( driveFileXhr.status == 200 ) {
//              200=OK
                console.log( driveFileXhr.response );

                file.$src.innerHTML = driveFileXhr.response;
            }
        }
    }
    driveFileXhr.send();
}

p.onDriveFileDownloadReady = function(resp) {

}