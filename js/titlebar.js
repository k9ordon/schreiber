var Titlebar = function() {
        this.$el = document.querySelector('.titlebar');
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
