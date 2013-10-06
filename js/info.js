var Info = function() {
        this.$el = null;
    },
    p = Info.prototype;

p.init = function() {
    this.$el = app.file.$el.querySelector('.info');
    
    console.log('info init');

    this.events();
    return this;
};

p.events = function() {

}

p.update = function() {
    console.log('info update');

    var md = app.file.editor.getValue();

    var tokens = marked.lexer(md,{gfm:true}),
    html = marked.parser(tokens)
    console.log(html);

    app.file.info.$el.innerHTML = JSON.stringify(tokens, undefined, 2);;
};