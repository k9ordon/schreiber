var File = function() {
        this.$template = document.querySelector('#fileTemplate');
		this.$el = null;  //document.querySelector('#file');
		this.$src = null; //this.$el.querySelector('#src');
        this.$preview = null; //this.$el.querySelector('#preview');

        this.editor = null;
        this.preview = new Preview;

		this.driveId = null;
	},
	p = File.prototype;

p.init = function(driveId) {
	console.log('File init');
	
    var t = document.createElement('div');
    t.innerHTML = this.$template.innerText;
    
    this.$el = t.firstChild;
    document.body.appendChild(this.$el);
    
    this.$src = this.$el.querySelector('#src');
    this.$preview = this.$el.querySelector('#preview');


    this.editor = CodeMirror.fromTextArea(this.$src, {
        mode: 'gfm',
        lineNumbers: false,
        theme: "schreiber",
        lineWrapping: true,
        //styleSelectedText: true,
        styleActiveLine: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });

    this.events();
    this.preview.init();

	return this;
};

p.events = function() {
    this.editor.on("change", function(cm) {
        app.setDistractionFree(true);
        app.file.preview.update();
    });

    this.editor.on("cursorActivity", function(cm) {
        app.setDistractionFree(true);
    });

    this.editor.on("blur", function(cm) {
        app.setDistractionFree(false);
        console.log('blur');
    });

    this.editor.on("viewportChange", function(em, from, to) {
        console.log(['viewportChange', from, to]);
    });
}


p.updatePreview = function() {
    //console.log('updatePreview', this.$src.innerHTML, marked(this.$src.innerHTML));
    console.log(marked.lexer(this.$src.innerText, {}));

    this.$preview.innerHTML = marked(this.$src.innerText);
}

p.loadDriveFile = function(driveId) {
    this.driveId = driveId;

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

    console.log('request', request);

	request.execute(app.file.onDriveFileInfoReady);
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

                app.file.editor.setValue(driveFileXhr.response);
                app.file.updatePreview();
            }
        }
    }
    driveFileXhr.send();
}

p.onDriveFileDownloadReady = function(resp) {

}