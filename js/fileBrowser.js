var FileBrowser = function() {
        this.$el = document.querySelector('#fileBrowser');
        this.$newFile = document.querySelector('#newFile');
        this.$openPickerButton = document.querySelector('#openPickerButton');
        this.$fileTemplate = document.querySelector('#fileBrowserFileTemplate');
        this.$currentDocuments = document.querySelector('#currentDocuments');
        this.$driveDocuments = document.querySelector('#driveDocuments');

        this.driveSpinnerLoading = null;
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

    this.$newFile.addEventListener('click', app.newFile);
}

p.addCurrentFile = function(file) {
    this.$fileTemplate;

    var t = document.createElement('div');
    t.innerHTML = this.$fileTemplate.innerText;
    var fileItem = t.firstChild;
    fileItem.innerHTML = file.data.name; 
    fileItem.setAttribute('data-fileidx', file.idx);

    this.$currentDocuments.appendChild(fileItem);

    fileItem.addEventListener('click', this.onCurrentFileItemClicked);

    var currentFileItem = document.querySelector('#currentFileItem');
    currentFileItem ? currentFileItem.id = '' : false;
    fileItem.id = 'currentFileItem';
}

p.onCurrentFileItemClicked = function(e) {
    var idx = e.srcElement.getAttribute('data-fileidx');

    console.log('current item clicked', e.srcElement.getAttribute('data-fileidx'));

    console.log(app.files[idx]);

    if(idx) {
        var currentFileItem = document.querySelector('#currentFileItem');
        currentFileItem ? currentFileItem.id = '' : false;
        e.srcElement.id = 'currentFileItem'; 

        app.files[idx].show(); 

    }
    
}

p.getDriveFiles = function() {
	var request = gapi.client.request({
		'path': '/drive/v2/files',
		'method': 'GET',
		'params': {
			'maxResults': 950,
			'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
			//'q': "mimeType contains 'text' and writers"
			//'q': "title contains 'meeting'"
		},
        "callback": app.fileBrowser.onDriveFilesReady
	});

    console.log('getDriveFiles');

    app.fileBrowser.$driveDocuments.classList.add('loading');
    app.fileBrowser.driveSpinnerLoading = new Spinner(app.smallSpinnerOpts).spin(app.fileBrowser.$driveDocuments);

    return;
	//request.execute(app.fileBrowser.onDriveFilesReady);
}

p.onDriveFilesReady = function(resp) {
	console.log(resp);

    app.fileBrowser.$driveDocuments.classList.remove('loading')

	var result = resp.items,
		i = 0;
	for (i = 0; i < result.length; i++) {

        if(result[i].title.indexOf('.md') >= 0 || result[i].title.indexOf('.markdown') >= 0) {
		  app.fileBrowser.$driveDocuments.innerHTML += '<div class="fileItem" data-driveId="'+result[i].id+'">'+result[i].title +'<small class="mimeTpye">'+result[i].mimeType+'</small> <small class="folder">'+'</small></p>';
        }

        //console.log([result[i]]);
	}

	app.fileBrowser.driveEvents();
}

p.driveEvents = function() {
	//this.$el.addEventListener('click', );
	[].forEach.call(
		this.$driveDocuments.querySelectorAll('.fileItem'), 
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

    var docsView = new google.picker.DocsView()
        .setParent('root')
        .setIncludeFolders(true);
        //.setMimeTypes('application/vnd.google-apps.folder')
        //.setSelectFolderEnabled(true);

    var picker = new google.picker.PickerBuilder().
        addView(docsView).
        addView(google.picker.ViewId.DOCUMENTS).
        //setDeveloperKey('AIzaSyDSZzmvuom74cwF16MnZ8dA_KFwqWMicWo').
        setCallback(function(a) { console.log('you choose file', a) }).
        hideTitleBar().
        setTitle('Select a Markdown Document').
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