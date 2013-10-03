var Preview = function() {
        this.$el = document.querySelector('#preview');
    },
    p = Preview.prototype;

p.init = function() {
    console.log('Preview init');
    this.events();
    return this;
};

p.events = function() {
};

p.update = function() {
    console.log('preview update');

    var html = marked(app.file.editor.getValue());
    this.$el.innerHTML = html;
};
