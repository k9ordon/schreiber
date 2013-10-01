var File = function() {
		this.$el = document.querySelector('#file');
		this.$src = this.$el.querySelector('#src');
        this.editor = null;
        this.$preview = this.$el.querySelector('#preview');
		this.driveId = null;

        this.currentKeyDownOffset;
	},
	p = File.prototype;

p.init = function(driveId) {
	console.log('File init');
	
    //this.updatePreview();
    //this.events();

    this.editor = CodeMirror.fromTextArea(this.$src, {
        mode: 'markdown',
        lineNumbers: true,
        theme: "schreiber",
        lineWrapping: true,
        //styleSelectedText: true,
        styleActiveLine: true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });

	return this;
};

p.events = function() {
    this.$src.addEventListener('keyup', this.onSrcKeyup);
    this.$src.addEventListener('keydown', this.onSrcKeydown);
}

p.onSrcKeydown = function(e) {
    var keyCode = e.keyCode || e.which; 

    var s = window.getSelection();
    file.currentKeyDownOffset = s.extentOffset;

    console.log('keydown', keyCode, this.currentKeyDownOffset);

    if (keyCode == 9) { 
        document.execCommand('styleWithCSS',true,null);
        document.execCommand('indent',true,null);
        e.preventDefault();
    }
}

p.onSrcKeyup = function() {
    console.log('keyup at ', file.currentKeyDownOffset);
    file.updatePreview();
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

                file.editor.setValue(driveFileXhr.response);
                file.updatePreview();
            }
        }
    }
    driveFileXhr.send();
}

p.onDriveFileDownloadReady = function(resp) {

}