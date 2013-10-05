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

    var html = app.file.editor.getValue(),
        html_cursor = app.file.preview.insertEditorCursorPositon(html);

    app.file.preview.$el.innerHTML = marked(html_cursor);
};

p.insertEditorCursorPositon = function(text) {
    var position = app.file.editor.getCursor(),
        newText = '',
        lines = text.split(/\n/);

    console.log('insertEditorCursorPositon', position, text.split(/\n/));

    for(var i = 0; i < lines.length; i++) {
        if(i === position.line) {
            
            var cLine = lines[i];
                newline = cLine.substring(0, position.ch) + 
                "|<span id='cursor'></span>" + 
                cLine.substring(position.ch, cLine.length) + 
                "\n";

            console.log('line:' + newline);
            newText += newline;            
        } else {
            newText += lines[i] + "\n";
        }
    }

    //console.log('new text' + newText);

    return newText;
};