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
}