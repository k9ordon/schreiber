var File = function() {
		this.$el = document.querySelector('#file');
		this.$src = this.$el.querySelector('#src');
        this.$preview = this.$el.querySelector('#preview');
		this.driveId = null;

        this.currentKeyDownOffset;
	},
	p = File.prototype;

p.init = function(driveId) {
	console.log('File init');
	
    this.updatePreview();
    this.events();

	return this;
};

p.events = function() {
    this.$src.addEventListener('keyup', this.onSrcKeyup);
    this.$src.addEventListener('keydown', this.onSrcKeydown);

    this.$preview.addEventListener('keyup', this.onPreviewKeyup);
    this.$preview.addEventListener('keydown', this.onPreviewKeydown);
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


p.onPreviewKeydown = function(e) {
    var keyCode = e.keyCode || e.which; 

    var s = window.getSelection();
    file.currentKeyDownOffset = s.extentOffset;

    //document.execCommand('defaultParagraphSeparator', false, 'p');

    console.log('preview keydown', keyCode, this.currentKeyDownOffset);
/*
    if (keyCode == 9) { 
        document.execCommand('styleWithCSS',true,null);
        document.execCommand('indent',true,null);
        e.preventDefault();
    } 
*/
}

p.onPreviewKeyup = function() {
    file.$src.innerText = toMarkdown(file.$preview.innerHTML.replace(/\<div\>/g, '<p>').replace(/\<\/div\>/g, '</p>'));
    //file.updatePreview();

}

p.updatePreview = function() {
    //console.log('updatePreview', this.$src.innerHTML, marked(this.$src.innerHTML));
    console.log(marked.lexer(this.$src.innerText, {}));

    this.$preview.innerHTML = marked(this.$src.innerText);
/*
    var tokens = marked.lexer(this.$src.innerText, {}),
        tokensLength = tokens.length;

    this.$preview.innerHTML = '';

    for(var i = 0; i < tokensLength; i++) {
        this.$preview.innerHTML += '<b>' + tokens[i].type + '</b> ' + JSON.stringify(tokens[i]) + '<br>';// .type + ' <b>' + (tokens[i].text ? tokens[i].text : '') + '</b><br>';
    }
*/

/*
    var s = window.getSelection();
    this.currentKeyDownOffset = s.extentOffset;

    file.$src.innerText = file.$src.innerText + '.';

    var range = document.createRange();
    range.selectNodeContents(this.$src);
    range.setStart(this.$src.firstChild, p+1);
    range.collapse(true);

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
*/
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

                file.$src.innerHTML = driveFileXhr.response;
                file.updatePreview();
            }
        }
    }
    driveFileXhr.send();
}

p.onDriveFileDownloadReady = function(resp) {

}