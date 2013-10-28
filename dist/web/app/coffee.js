(function() {
  var App, Document, Documents, Info, Preview, Slides, Titlebar;

  Titlebar = (function() {
    function Titlebar(app) {
      this.app = app;
      this.dom();
      this.events();
    }

    Titlebar.prototype.dom = function() {
      this.$el = document.querySelector('.titlebar');
      this.$title = this.$el.querySelector('.title');
      this.$toPreview = this.$el.querySelector('#toPreview');
      this.$toSlides = this.$el.querySelector('#toSlides');
      return this.$toDocuments = this.$el.querySelector('#toDocuments');
    };

    Titlebar.prototype.events = function() {
      this.$el.addEventListener('mouseover', this.app.distractionFreeLeave);
      this.$toPreview.addEventListener('click', this.app.togglePreview);
      this.$toSlides.addEventListener('click', this.app.toggleSlides);
      return this.$toDocuments.addEventListener('click', this.app.toggleDocuments);
    };

    Titlebar.prototype.setTitle = function(filename) {
      return this.$title.innerHTML = filename;
    };

    return Titlebar;

  })();

  Documents = (function() {
    function Documents(app) {
      this.app = app;
      this.instances = [];
      this.dom();
      this.events();
    }

    Documents.prototype.dom = function() {
      return this.$el = document.querySelector('#fileBrowser');
    };

    Documents.prototype.events = function() {
      return this.$el.addEventListener('mouseover', this.app.distractionFreeLeave);
    };

    Documents.prototype.add = function(documentInstance) {
      return this.instances.push(documentInstance);
    };

    Documents.prototype.get = function(idx) {
      return this.instances[idx];
    };

    return Documents;

  })();

  Slides = (function() {
    function Slides(app, d) {
      this.app = app;
      this.d = d;
      this.dom();
      this.events();
    }

    Slides.prototype.dom = function() {
      return this.$el = this.d.$el.querySelector('.slides');
    };

    Slides.prototype.events = function() {
      return this.$el.addEventListener('mouseover', this.app.distractionFreeLeave);
    };

    Slides.prototype.update = function() {
      var htmlSlides, markup, markupSlides, _i, _len;
      markupSlides = this.d.getValueWithCursor().split("\n---\n");
      htmlSlides = '';
      for (_i = 0, _len = markupSlides.length; _i < _len; _i++) {
        markup = markupSlides[_i];
        htmlSlides += '<div>' + marked(markup + '</div>');
      }
      return this.$el.innerHTML = htmlSlides;
    };

    Slides.prototype.updateScrollPosition = function() {
      return this.$el.scrollTop = this.$el.querySelector('#cursor').offsetTop - this.$el.offsetHeight / 2;
    };

    return Slides;

  })();

  Preview = (function() {
    function Preview(app, d) {
      this.app = app;
      this.d = d;
      this.dom();
      this.events();
    }

    Preview.prototype.dom = function() {
      return this.$el = this.d.$el.querySelector('.preview');
    };

    Preview.prototype.events = function() {
      return this.$el.addEventListener('mouseover', this.app.distractionFreeLeave);
    };

    Preview.prototype.update = function() {
      return this.$el.innerHTML = marked(this.d.getValueWithCursor());
    };

    Preview.prototype.updateScrollPosition = function() {
      return this.$el.scrollTop = this.$el.querySelector('#cursor').offsetTop - this.$el.offsetHeight / 2;
    };

    return Preview;

  })();

  Info = (function() {
    function Info(app, d) {
      this.app = app;
      this.d = d;
      this.dom();
      this.events();
    }

    Info.prototype.dom = function() {
      return this.$el = this.d.$el.querySelector('.info');
    };

    Info.prototype.events = function() {
      return this.$el.addEventListener('mouseover', this.app.distractionFreeLeave);
    };

    Info.prototype.update = function() {
      var tokens;
      tokens = markdown.parse(this.d.cm.getValue());
      return this.$el.innerHTML = '<pre>' + JSON.stringify(tokens, void 0, 2) + '</pre>';
    };

    return Info;

  })();

  Document = (function() {
    function Document(app, InkBlob) {
      this.app = app;
      this.InkBlob = InkBlob;
      console.log(this.app.$el, this.InkBlob);
      this.create();
      this.sub();
      this.dom();
      this.createCodeMirror();
      this.events();
    }

    Document.prototype.create = function() {
      var t, tpl;
      tpl = document.querySelector('#fileTemplate');
      t = document.createElement('div');
      t.innerHTML = tpl.innerHTML;
      this.$el = t.firstChild;
      return this.app.$el.appendChild(this.$el);
    };

    Document.prototype.sub = function() {
      this.info = new Info(this.app, this);
      this.preview = new Preview(this.app, this);
      return this.slides = new Slides(this.app, this);
    };

    Document.prototype.dom = function() {
      this.$src = this.$el.querySelector('#src');
      return this.$preview = this.$el.querySelector('#preview');
    };

    Document.prototype.createCodeMirror = function() {
      var config;
      config = {
        mode: 'gfm',
        lineNumbers: false,
        theme: "schreiber",
        lineWrapping: true,
        matchBrackets: true,
        styleSelectedText: true,
        styleActiveLine: true,
        extraKeys: {
          "Enter": "newlineAndIndentContinueMarkdownList"
        },
        viewportMargin: 1000
      };
      this.cm = CodeMirror.fromTextArea(this.$src, config);
      if (this.text) {
        return this.cm.setValue(this.text);
      }
    };

    Document.prototype.events = function() {
      this.cm.on("change", function() {
        this.app.distractionFreeEnter();
        this.app.d.info.update();
        this.app.d.preview.update();
        this.app.d.preview.updateScrollPosition();
        return this.app.d.slides.update();
      });
      this.cm.on("cursorActivity", function() {
        this.app.d.info.update();
        this.app.d.preview.update();
        this.app.d.preview.updateScrollPosition();
        return this.app.d.slides.update();
      });
      return this.cm.on("blur", function() {
        return this.app.distractionFreeLeave();
      });
    };

    Document.prototype.show = function() {
      this.app.d.$el.id = '';
      this.$el.id = 'currentFile';
      this.app.d.cm.refresh();
      this.app.d.cm.focus();
      return this.app.titlebar.setTitle(this.title);
    };

    Document.prototype.save = function(e) {
      e.preventDefault();
      return alert('save');
    };

    Document.prototype.getValueWithCursor = function() {
      var cursor, cursorText, line, lines, text, _i, _len;
      text = this.cm.getValue();
      cursor = this.cm.getCursor();
      lines = text.split("\n");
      cursorText = '';
      for (line = _i = 0, _len = lines.length; _i < _len; line = ++_i) {
        text = lines[line];
        if (line === cursor.line) {
          cursorText += text.substring(0, cursor.ch);
          cursorText += "|<span id='cursor'></span>";
          cursorText += text.substring(cursor.ch, text.length);
          cursorText += "\n";
        } else {
          cursorText += text + "\n";
        }
      }
      return cursorText;
    };

    return Document;

  })();

  App = (function() {
    function App() {
      this.dom();
      this.sub();
      this.show();
      this.events();
      filepicker.setKey("ArBbG8nVdT6esL691Pkdvz");
    }

    App.prototype.dom = function() {
      this.$el = document.querySelector('#app');
      this.$loading = document.querySelector('#loading');
      return this.$openPicker = document.querySelector('#openPickerButton');
    };

    App.prototype.sub = function() {
      this.titlebar = new Titlebar(this);
      return this.documents = new Documents(this);
    };

    App.prototype.events = function() {
      Mousetrap.bindGlobal('command+s', this.d.save);
      Mousetrap.bindGlobal('command+p', this.togglePreview);
      Mousetrap.bindGlobal('command+p', this.openPicker);
      return this.$openPicker.addEventListener('click', this.openPicker);
    };

    App.prototype.show = function() {
      this.openDocument(false);
      this.$el.classList.remove('hidden');
      return this.$loading.classList.add('hidden');
    };

    App.prototype.showDocuments = function() {
      return console.log('showDocuments');
    };

    App.prototype.openPicker = function() {
      return filepicker.pick({
        container: 'modal',
        extensions: ['.md', '.markdown', '.txt'],
        services: ['GOOGLE_DRIVE', 'GITHUB', 'DROPBOX', 'COMPUTER', 'FTP', 'WEBDAV']
      }, function(InkBlob) {
        console.log(JSON.stringify(InkBlob));
        return app.openDocument(JSON.stringify(InkBlob));
      }, function(FPError) {
        return console.log(FPError.toString());
      });
    };

    App.prototype.togglePreview = function(e) {
      e.preventDefault();
      if (!document.body.classList.contains('preview')) {
        console.log('showPreview');
        return document.body.classList.add('preview');
      } else {
        console.log('hidePreview');
        return document.body.classList.remove('preview');
      }
    };

    App.prototype.toggleSlides = function(e) {
      e.preventDefault();
      if (!document.body.classList.contains('slides')) {
        console.log('showSlides');
        return document.body.classList.add('slides');
      } else {
        console.log('hideSlides');
        return document.body.classList.remove('slides');
      }
    };

    App.prototype.openDocument = function(InkBlob) {
      this.d = new Document(this, InkBlob);
      this.documents.add(this.d);
      return this.d.show();
    };

    App.prototype.distractionFreeEnter = function() {
      return document.body.classList.add('distractionFree');
    };

    App.prototype.distractionFreeLeave = function() {
      return document.body.classList.remove('distractionFree');
    };

    App.prototype.onGapiReady = function() {
      return this.drive = new Drive(this);
    };

    return App;

  })();

  window.app = new App;

  window.onGapiReady = app.onGapiReady;

}).call(this);

/*
//@ sourceMappingURL=coffee.js.map
*/