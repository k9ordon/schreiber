var File = function() {
        this.title = null;

        this.$template = document.querySelector('#fileTemplate');
        this.$welcomefileTemplate = document.querySelector('#welcomefileTemplate');
		this.$el = null;  //document.querySelector('#file');
		this.$src = null; //this.$el.querySelector('#src');
        this.$preview = null; //this.$el.querySelector('#preview');

        this.editor = null;
        this.preview = new Preview;
        this.info = new Info;

		this.driveId = null;

        this.idx = app.files.length;

        this.data = {
            name : 'welcome.md',
            content : '# hello \n Dublin'
        }
	},
	p = File.prototype;

p.init = function(driveId, title, text) {
	console.log('File init', driveId, title);

    this.title = title;
	
    var t = document.createElement('div');
    t.innerHTML = this.$template.innerText;
    this.$el = t.firstChild;
    app.$el.appendChild(this.$el);

    this.$src = this.$el.querySelector('#src');
    this.$preview = this.$el.querySelector('#preview');

    this.editor = CodeMirror.fromTextArea(this.$src, {
        mode: 'markdown',
        lineNumbers: false,
        theme: "schreiber",
        lineWrapping: true,
        styleSelectedText: true,
        styleActiveLine: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
        viewportMargin: 1000
    });
    //this.editor.setSize('100%','400px');
    
    if(text) {
       this.editor.setValue(text); 
    }
    
    app.fileBrowser.addCurrentFile(this);

    this.show();
    this.events();

    this.info.init();
    this.info.update();

    this.preview.init();
    this.preview.update();

	return this;
};

p.show = function() {
    console.log('show file', this.$el);

    var currentFile = document.querySelector('#currentFile');
    currentFile ? currentFile.id = '' : false;

    this.$el.id = 'currentFile';

    app.file = this;

    app.titlebar.setTitle(app.file.title);

    app.file.editor.refresh();//
    app.file.editor.focus();
}

p.setContent = function() {

}

p.events = function() {
    this.editor.on("change", function(cm) {
        app.setDistractionFree(true);
        app.file.preview.update();
        app.file.info.update();
    });

    this.editor.on("cursorActivity", function(cm) {
        //app.setDistractionFree(true);
        app.file.preview.update();
        app.file.info.update();
    });

    this.editor.on("blur", function(cm) {
        app.setDistractionFree(false);
        console.log('blur');
    });

    this.editor.on("viewportChange", function(em, from, to) {
        console.log(['viewportChange', from, to]);
    });
}

p.loadDriveFile = function(driveId) {
    this.driveId = driveId;

	var request = gapi.client.request({
		'path': '/drive/v2/files/' + this.driveId,
		'method': 'GET',
		'params': {
			'maxResults': 100,
			'q': "mimeType = 'text/x-markdown' or mimeType = 'text/plain' or mimeType = 'application/octet-stream'"
			//'q': "mimeType contains 'text' and writers"
			//'q': "title contains 'meeting'"
		},
        'callback': app.file.onDriveFileInfoReady
	});

    console.log('request', request);
}

p.onDriveFileInfoReady = function(resp) {
	console.log('onDriveFileReady', resp);

	var driveFileXhr   = new XMLHttpRequest();

    driveFileXhr.open('GET', resp.downloadUrl, true);
    driveFileXhr.setRequestHeader('Authorization', 'Bearer ' + app.googledrive.token );

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

p.getValueWithCursor = function() {
    var text = app.file.editor.getValue();
        position = app.file.editor.getCursor(),
        newText = '',
        lines = text.split(/\n/);

    //console.log('insertEditorCursorPositon', position, text.split(/\n/));

    for(var i = 0; i < lines.length; i++) {
        if(i === position.line) {
            
            var cLine = lines[i];
                newline = cLine.substring(0, position.ch) + 
                "|<span id='cursor'></span>" + 
                cLine.substring(position.ch, cLine.length) + 
                "\n";

            //console.log('line:' + newline);
            newText += newline;            
        } else {
            newText += lines[i] + "\n";
        }
    }

    //console.log('new text' + newText);

    return newText;
};