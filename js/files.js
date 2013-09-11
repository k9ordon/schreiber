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