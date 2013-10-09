var Googledrive = function() {
        this.CLIENT_ID = '140224327941.apps.googleusercontent.com';//'140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        this.SCOPES = 'https://www.googleapis.com/auth/drive';
        this.token = null;
    },
    p = Googledrive.prototype;

p.init = function() {
    console.log('googleDrive init');
    app.googledrive.authorize();
}

p.authorize = function() {
    var params = {};

    //if (!(chrome && chrome.app && chrome.app.runtime)) {
        params.client_id = app.CLIENT_ID;
        params.scope = app.SCOPES; 
    //}

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

    app.googledrive.token = auth.access_token;

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
};
var Titlebar = function() {
        this.$el = document.querySelector('.titlebar');
        this.$title = this.$el.querySelector('.title');
        this.$toPreview = this.$el.querySelector('#toPreview');
        this.$toDocuments = this.$el.querySelector('#toDocuments');  
    },
    p = Titlebar.prototype;

p.init = function() {

    
    console.log('titlebar init', this.$el);

    this.events();
    return this;
};

p.events = function() {
    this.$el.addEventListener('mouseover', function(){
        //console.log('mouseover');
        app.setDistractionFree(false);
    });

    this.$toPreview.addEventListener('click', app.showPreview);
    this.$toDocuments.addEventListener('click', app.showDocuments);
};

p.loadUserbadge = function() {
    var request = gapi.client.request({
        'path': 'userinfo/email',
        'method': 'GET',
        'callback': function(a) { console.log(a.body) }
    });
};

p.setTitle = function(text) {
    this.$title.innerText = text;
};;
var Info = function() {
        this.$el = null;
    },
    p = Info.prototype;

p.init = function() {
    this.$el = app.file.$el.querySelector('.info');
    
    console.log('info init');

    this.events();
    return this;
};

p.events = function() {

}

p.update = function() {
    console.log('info update');

    var md = app.file.getValueWithCursor();
/*
    var tokens = marked.lexer(md,{gfm:true}),
    html = marked.parser(tokens)
    console.log(html);
*/
    var tokens = markdown.parse(md);
    console.log(tokens);
    app.file.info.$el.innerHTML = '<pre>' + JSON.stringify(tokens, undefined, 2) + '</pre>';
};;
var Preview = function() {
        this.$el = null;
    },
    p = Preview.prototype;

p.init = function() {
    this.$el = app.file.$el.querySelector('.preview');
    
    console.log('Preview init', app.file.$el, this.$el);

    this.events();
    return this;
};

p.events = function() {
    
};

p.update = function() {
    console.log('preview update');

    var md = app.file.getValueWithCursor(),
        html = marked(md);

    app.file.preview.$el.innerHTML = html;

    app.file.preview.updateScrollPosition();
};

p.updateScrollPosition = function() {
    var $cursor = app.file.preview.$el.querySelector('#cursor');

    console.log('cursor offset', $cursor.offsetTop); 

    app.file.preview.$el.scrollTop = $cursor.offsetTop - (app.file.preview.$el.offsetHeight) / 2;
};
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
        mode: 'gfm',
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
};;
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

    this.$newFile.addEventListener('click', function() { app.openFile(null,'*.md'); });
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
    fileItem.innerText = file.title;

    var currentFileItem = document.querySelector('#currentFileItem');
    currentFileItem ? currentFileItem.id = '' : false;
    fileItem.id = 'currentFileItem';
}

p.removeCurrentFile = function(idx) {
    // remove dom node
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
	app.openFile($filesItem.getAttribute('data-driveId'), $filesItem.innerText);
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
};
var App = function() {
        // loading spinner
        this.bigSpinnerOpts = {
          lines: 15, length: 5, width: 1, radius: 10, color: '#657b83'
        };
        this.smallSpinnerOpts = {
          lines: 9, length: 3, width: 1, radius: 4, color: '#657b83'
        };
        var spinnerLoading = new Spinner(this.smallSpinnerOpts).spin(document.querySelector('#spinner'));


        this.$el = document.querySelector('#app');
        this.$loading = document.querySelector('#loading');

        var o = window.location.origin;
        
        if(o === "http://schreiber-dev.k94n.com")
            this.CLIENT_ID = '140224327941.apps.googleusercontent.com';
        else if(o === "http://schreiber.k94n.com")
            this.CLIENT_ID = '140224327941-66s2fenc5nlln3shi4r1b04ho2jvgerr.apps.googleusercontent.com';
        else if(o === "chrome-extension://fmgcelokejjmhifoocmnpmmklnaigiph")
            this.CLIENT_ID = '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com';
        else if(o === "file://")
            this.CLIENT_ID = '140224327941-553f7v0a14p71ute2ogtrm1anbcsmhcl.apps.googleusercontent.com';
        else
            alert('no valid api key for ' + o);

        this.SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/userinfo.email'];
        this.googledrive = new Googledrive;
        this.onGapiReady = this.googledrive.init;
        this.titlebar = new Titlebar;
        this.fileBrowser = new FileBrowser;
        this.file = null; // current file
        this.files = [];
        this.currentFile
        this.currentKeyDownOffset;

        this.$titlebar = document.querySelector('.titlebar');
    },
    p = App.prototype;

p.init = function() {
    console.log('app init');
    this.titlebar.init();
    this.fileBrowser.init();

    this.openFile(null, 'welcome.md', 'yoyo');
    this.events();
}

p.show = function() {
    this.$el.classList.remove('hidden');
    this.$loading.classList.add('hidden');
}

p.openFile = function(driveId, title, text) {
    app.file = new File;
    
    app.files.push(app.file);
    app.file.init(driveId, title, text);
}

p.events = function() {
    Mousetrap.bindGlobal('command+s', function(e) {
        console.log('save');
        alert('save ...');
        //e.preventDefault();
        return false;
    });

    Mousetrap.bindGlobal('command+p', function(e) {
        app.showPreview();
        return false;
    });
}

p.setDistractionFree = function(bool) {
    if(bool === true) {
        document.body.classList.add('distractionFree');
        return;
    }
    document.body.classList.remove('distractionFree');
}

p.showPreview = function() {
    console.log('show Preview');

    if(document.body.classList.contains('preview')) {
        app.hidePreview();
        return true;
    }

    document.body.classList.add('preview');
}

p.hidePreview = function() {
    console.log('hide Preview');
    document.body.classList.remove('preview');
}

p.showDocuments = function() {
    console.log('show Documents');
};
var WindowControls = function() {
        this.$windowClose = document.querySelector('#windowClose');
        this.$windowMinimize = document.querySelector('#windowMinimize');
        this.$windowMaximize = document.querySelector('#windowMaximize');
    },
    p = WindowControls.prototype;

p.init = function() {
    console.log('windo init');
    this.events();
}

p.events = function() {
    Mousetrap.bindGlobal('command+w', this.windowClose);
    Mousetrap.bindGlobal('command+f', this.windowFullscreen);

    this.$windowClose.addEventListener('click', this.windowClose);
    this.$windowMinimize.addEventListener('click', this.windowMinimize);
    this.$windowMaximize.addEventListener('click', this.windowMaximize);
}

p.windowClose = function() {
    chrome.app.window.current().close();
}

p.windowMinimize = function() {
    chrome.app.window.current().minimize();
}

p.windowMaximize = function() {
    var cw = chrome.app.window.current();

    if(cw.isMaximized()) {
        cw.restore();
    } else {
        cw.maximize();
    }
}

p.windowFullscreen = function() {
    var cw = chrome.app.window.current();

    if(cw.isFullscreen()) {
        cw.restore();
    } else {
        cw.fullscreen();
    }
};
var app = new App,
    gapiIsLoaded = app.onGapiReady,
    p = null,
    windowControls = new WindowControls;

document.addEventListener('DOMContentLoaded', function(e) {
    app.init();
    windowControls.init();
});;
/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
/**
 * gapi-chrome-apps version 0.001
 *
 * Provides the Google API javascript client 'gapi' as
 * appropriate for hosted websites, or if in a Chrome packaged
 * app implement a minimal set of functionality that is Content
 * Security Policy compliant and uses the chrome identity api.
 *
 * https://github.com/GoogleChrome/chrome-app-samples/tree/master/gapi-chrome-apps-lib
 *
 */
"use strict";

(function () {
  if (typeof gapi !== 'undefined')
    throw new Error('gapi already defined.');
  if (typeof gapiIsLoaded !== 'function')
    throw new Error('gapiIsLoaded callback function must be defined prior to ' +
                    'loading gapi-chrome-apps.js');

  // If not running in a chrome packaged app, load web gapi:
  if (!(chrome && chrome.app && chrome.app.runtime)) {
    // Load web gapi.
    var script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js?onload=gapiIsLoaded';
    document.documentElement.appendChild(script);
    return;
  }

  window.gapi = {};
  gapi.auth = {};
  gapi.client = {};

  var access_token = undefined;

  gapi.auth.authorize = function (params, callback) {
    if (typeof callback !== 'function')
      throw new Error('callback required');

    var details = {}
    details.interactive = params.immediate === false || false;
    console.assert(!params.response_type || params.response_type == 'token')

    var callbackWrapper = function (getAuthTokenCallbackParam) {
      access_token = getAuthTokenCallbackParam;
      // TODO: error conditions?
      if (typeof access_token !== 'undefined')
        callback({ access_token: access_token});
      else
        callback();
    }

    chrome.identity.getAuthToken(details, callbackWrapper);
  };


  gapi.client.request = function (args) {
    if (typeof args !== 'object')
      throw new Error('args required');
    if (typeof args.callback !== 'function')
      throw new Error('callback required');
    if (typeof args.path !== 'string')
      throw new Error('path required');

    var path = 'https://www.googleapis.com' + args.path;
    if (typeof args.params === 'object') {
      var deliminator = '?';
      for (var i in args.params) {
        path += deliminator + encodeURIComponent(i) + "="
          + encodeURIComponent(args.params[i]);
        deliminator = '&';
      }
    }

    var xhr = new XMLHttpRequest();
    xhr.open(args.method || 'GET', path);
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    if (typeof args.body !== 'undefined') {
      xhr.setRequestHeader('content-type', 'application/json');
      xhr.send(JSON.stringify(args.body));
    } else {
      xhr.send();
    }

    xhr.onerror = function () {
      // TODO, error handling.
      debugger;
    };

    xhr.onload = function() {
      var rawResponseObject = {
        // TODO: body, headers.
        gapiRequest: {
          data: {
            status: this.status,
            statusText: this.statusText
          }
        }
      };

      var jsonResp = JSON.parse(this.response);
      var rawResp = JSON.stringify(rawResponseObject);
      args.callback(jsonResp, rawResp);
    };
  };

  // Call client handler when gapi is ready.
  setTimeout(function () { gapiIsLoaded(); }, 0);
})();
