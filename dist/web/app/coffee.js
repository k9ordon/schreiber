(function() {
  var App, Document, Titlebar;

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

  Document = (function() {
    function Document(app, driveId, title, text) {
      this.app = app;
      this.driveId = driveId;
      this.title = title;
      this.text = text;
      console.log(this.app.$el);
      this.create();
      this.dom();
      this.createCodeMirror();
    }

    Document.prototype.dom = function() {
      this.$src = this.$el.querySelector('#src');
      return this.$preview = this.$el.querySelector('#preview');
    };

    Document.prototype.create = function() {
      var t, tpl;
      tpl = document.querySelector('#fileTemplate');
      t = document.createElement('div');
      t.innerHTML = tpl.innerHTML;
      this.$el = t.firstChild;
      return this.app.$el.appendChild(this.$el);
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

    Document.prototype.events = function() {};

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
      this.show();
      this.openFile(false, 'welcome.md', 'welcome');
    }

    App.prototype.dom = function() {
      this.$el = document.querySelector('#app');
      return this.$loading = document.querySelector('#loading');
    };

    App.prototype.sub = function() {
      this.titlebar = new Titlebar(this);
      return this.documents = [];
    };

    App.prototype.show = function() {
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

    return App;

  })();

  setTimeout((function() {
    return window.app = new App;
  }), 100);

}).call(this);

/*
//@ sourceMappingURL=coffee.js.map
*/