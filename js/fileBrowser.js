var FileBrowser = function() {
		this.$el = document.querySelector('#fileBrowser');
        this.$openPickerButton = this.$el.querySelector('#openPickerButton');
	},
	p = FileBrowser.prototype;

p.init = function() {
	console.log('fileBrowser init');
	this.events();
	return this;
};

p.events = function() {
    this.$openPickerButton.addEventListener('click', app.fileBrowser.openDrivePicker);
    this.$el.addEventListener('mouseover', function(){
        console.log('mouseover');
        app.setDistractionFree(false);
    });
}

p.onGapiReady = function() {
	console.log('Google api ready' + app.CLIENT_ID);

	gapi.auth.authorize({
			'client_id': app.CLIENT_ID, 
			'scope': app.SCOPES, 
			//'immediate': true
		},
        function(pew) {
            console.log('auth ready', pew);
			app.fileBrowser.getDriveFiles();
		}		
	);
};

p.getDriveFiles = function() {
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

p.onDriveFilesReady = function(resp) {
	console.log(resp);

	var result = resp.items,
		i = 0;
	for (i = 0; i < result.length; i++) {
		app.fileBrowser.$el.innerHTML += '<p data-driveId="'+result[i].id+'">'+result[i].title +'<small class="mimeTpye">'+result[i].mimeType+'</small> <small class="folder">'+'</small></p>';
		console.log([result[i]]);
	}

	app.fileBrowser.driveEvents();
}

p.driveEvents = function() {
	//this.$el.addEventListener('click', );
	[].forEach.call(
		this.$el.querySelectorAll('p'), 
		function($filesItem){
			$filesItem.addEventListener('click', function() {
				app.fileBrowser.onFilesItemClick($filesItem);
			})
		}
	);
};

p.onFilesItemClick = function($filesItem) {
	console.log('clicked', $filesItem);
	app.file.loadDriveFile($filesItem.getAttribute('data-driveId'));
}

p.openDrivePicker = function(e) {
    console.log('open drive picker');
    gapi.load('picker', {'callback': app.fileBrowser.openDrivePickerReady });
}

p.openDrivePickerReady = function() {
    console.log('openDrivePickerReady', google);

    var picker = new google.picker.PickerBuilder().
        addView(google.picker.ViewId.IMAGE_SEARCH).
        setDeveloperKey('gv-sYwfyYRCRxrhpBChelBSK').
        setCallback(files.onDrivePickerClicked).
        build();
        picker.setVisible(true);
}

// A simple callback implementation.
p.onDrivePickerClicked = function(data) {
    var url = 'nothing';
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      var doc = data[google.picker.Response.DOCUMENTS][0];
      url = doc[google.picker.Document.URL];
    }
    var message = 'You picked: ' + url;
    document.getElementById('result').innerHTML = message;
}