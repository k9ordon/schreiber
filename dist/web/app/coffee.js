(function() {
  var App, Document, Preview, Titlebar;

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
      return this.$toDocuments = this.$el.querySelector('#toDocuments');
    };

    Titlebar.prototype.events = function() {
      var _this = this;
      this.$toPreview.addEventListener('click', function(e) {
        return _this.app.showPreview();
      });
      return this.$toDocuments.addEventListener('click', function(e) {
        return _this.app.showDocuments();
      });
    };

    return Titlebar;

  })();

  Preview = (function() {
    function Preview(app, file) {
      this.app = app;
      this.file = file;
      this.dom();
    }

    Preview.prototype.dom = function() {
      return this.$el = this.file.$el.querySelector('.preview');
    };

    Preview.prototype.update = function() {
      return console.log('preview upadte');
    };

    return Preview;

  })();

  Document = (function() {
    function Document(app, driveId, title, text) {
      this.app = app;
      this.driveId = driveId;
      this.title = title;
      this.text = text;
      console.log(this.app.$el);
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
      return this.preview = new Preview(this.app, this);
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
        styleSelectedText: true,
        styleActiveLine: true,
        extraKeys: {
          "Enter": "newlineAndIndentContinueMarkdownList"
        },
        viewportMargin: 1000
      };
      this.cm = CodeMirror.fromTextArea(this.$src, config);
      return this.cm.setValue(this.text);
    };

    Document.prototype.events = function() {
      return this.cm.on("change", function() {
        this.app.setDistractionFree(true);
        return this.app.d.preview.update();
      });
    };

    Document.prototype.show = function() {
      this.app.d.$el.id = '';
      this.$el.id = 'currentFile';
      this.app.d.cm.refresh();
      return this.app.d.cm.focus();
    };

    return Document;

  })();

  App = (function() {
    function App() {
      this.dom();
      this.sub();
      this.load();
    }

    App.prototype.dom = function() {
      this.$el = document.querySelector('#app');
      return this.$loading = document.querySelector('#loading');
    };

    App.prototype.sub = function() {
      this.titlebar = new Titlebar(this);
      return this.documents = [];
    };

    App.prototype.load = function() {
      this.openFile(false, 'welcome.md', 'welcome');
      this.$el.classList.remove('hidden');
      return this.$loading.classList.add('hidden');
    };

    App.prototype.showDocuments = function() {
      return console.log('showDocuments');
    };

    App.prototype.showPreview = function() {
      return console.log('showPreview');
    };

    App.prototype.openFile = function(dId, title, text) {
      this.dId = dId;
      this.title = title;
      this.text = text;
      this.d = new Document(this, this.dId, this.title, this.text);
      this.documents.push(this.d);
      return this.d.show();
    };

    App.prototype.setDistractionFree = function(bool) {
      this.bool = bool;
      if (this.bool) {
        return document.body.classList.add('distractionFree');
      }
    };

    return App;

  })();

  window.app = new App;

}).call(this);

/*
//@ sourceMappingURL=coffee.js.map
*/