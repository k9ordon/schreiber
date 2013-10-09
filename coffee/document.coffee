class Document

    constructor: (@app, @driveId, @title, @text) ->
        console.log @app.$el
 
        @create()
        @dom()
        @createCodeMirror()

    dom: ->
        @$src = @$el.querySelector('#src')
        @$preview = @$el.querySelector('#preview')        
        
    create: ->
        tpl = document.querySelector '#fileTemplate'
        t = document.createElement 'div'
        t.innerHTML = tpl.innerHTML
        @$el = t.firstChild
        @app.$el.appendChild @$el

    createCodeMirror: ->
        config = 
            mode: 'gfm'
            lineNumbers: false
            theme: "schreiber"
            lineWrapping: true
            styleSelectedText: true
            styleActiveLine: true
            extraKeys: 
                "Enter": "newlineAndIndentContinueMarkdownList"
            viewportMargin: 1000

        @cm = CodeMirror.fromTextArea @$src, config
        @cm.setValue @text

    events: ->

    show: ->
        @app.d.$el.id = ''
        @$el.id = 'currentFile'

        @app.d.cm.refresh()
        @app.d.cm.focus()