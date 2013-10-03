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
    console.log('preview update', this.$el);

    var html = marked(app.file.editor.getValue());
    this.$el.innerHTML = html;
};
