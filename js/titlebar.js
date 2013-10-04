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

p.loadUserbadge = function() {
    var request = gapi.client.request({
        'path': 'userinfo/email',
        'method': 'GET'
    });
    request.execute(function(a) { console.log(a.body) });
};
