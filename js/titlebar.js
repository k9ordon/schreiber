var Titlebar = function() {
        this.$el = null;
    },
    p = Titlebar.prototype;

p.init = function() {
    this.$el = document.querySelector('.titlebar');
    
    console.log('titlebar init', this.$el);

    this.events();
    return this;
};

p.events = function() {
    
};

p.getUsername = function() {
    
};
