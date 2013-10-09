(function() {
  var App, Titlebar, app;

  Titlebar = (function() {
    function Titlebar(app) {
      this.app = app;
      console.log('Titlebar init');
      this.dom();
      this.events();
    }

    Titlebar.prototype.dom = function() {
      this.$el = document.querySelector('.titlebar');
      return this.$title = this.$el.querySelector('.title');
    };

    Titlebar.prototype.events = function() {
      var _this = this;
      return this.$el.addEventListener('mouseover', function(e) {
        return console.log('titlebar hover');
      });
    };

    return Titlebar;

  })();

  App = (function() {
    function App() {
      this.titlebar = new Titlebar(App);
    }

    return App;

  })();

  app = new App;

}).call(this);

/*
//@ sourceMappingURL=coffee.js.map
*/