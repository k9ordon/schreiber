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

    var md = app.file.getValueWithCursor();
/*
    var tokens = marked.lexer(md,{gfm:true}),
    html = marked.parser(tokens)
    console.log(html);
*/
    var tokens = markdown.parse(md);
    console.log(tokens);
    app.file.info.$el.innerHTML = '<pre>' + JSON.stringify(tokens, undefined, 2) + '</pre>';
};