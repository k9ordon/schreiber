var Files = function() {
		this.$el = document.querySelector('#files');
	},
	p = Files.prototype;

p.init = function() {
	console.log('Files init');
	//this.events();
	return this;
};

p.onGapiReady = function() {
	console.log('Google api ready');
	gapi.auth.authorize({
			'client_id': CLIENT_ID, 
			'scope': SCOPES, 
			'immediate': true
		},
        function() {
			files.getDriveFiles();
		}		
	);
};

p.getDriveFiles = function() {
	var request = gapi.client.request({
		'path': 'drive/v2/files',
		'method': 'GET',
		'params': {
			//'maxResults': 100,
			'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
			//'q': "mimeType contains 'text' and writers"
			//'q': "title contains 'meeting'"
		}
	});
	request.execute(files.onDriveFilesReady);
}

p.onDriveFilesReady = function(resp) {
	console.log(resp);
	var result = resp.items,
		i = 0;
	for (i = 0; i < result.length; i++) {
		files.$el.innerHTML += '<p data-driveId="'+result[i].id+'">'+result[i].title + ' - ' +  result[i].mimeType +'</p>';
		//console.log([result[i].title, result[i].mimeType]);
	}

	files.events();
}

p.events = function() {
	//this.$el.addEventListener('click', );
	[].forEach.call(
		this.$el.querySelectorAll('p'), 
		function($filesItem){
			$filesItem.addEventListener('click', function() {
				files.onFilesItemClick($filesItem);
			})
		}
	);
};

p.onFilesItemClick = function($filesItem) {
	console.log('clicked', $filesItem);
	file = new File();
	file.init($filesItem.getAttribute('data-driveId'));
}

/* **********************************************
     Begin app.js
********************************************** */

var CLIENT_ID = '140224327941.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

var files = new Files;
files.init();

var file;

var googleapiready = files.onGapiReady;

/* **********************************************
     Begin file.js
********************************************** */

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