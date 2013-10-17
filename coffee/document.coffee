class Document

    constructor: (@app, @driveId, @title, @text) ->
        console.log @app.$el
 
        @create()
        @sub()
        
        @dom()
        @createCodeMirror()

        @events()

    create: ->
        tpl = document.querySelector '#fileTemplate'
        t = document.createElement 'div'
        t.innerHTML = tpl.innerHTML
        @$el = t.firstChild
        @app.$el.appendChild @$el

    sub: ->
        @preview = new Preview @app, @

    dom: ->
        @$src = @$el.querySelector('#src')
        @$preview = @$el.querySelector('#preview')

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
        @cm.on "change", () ->
            @app.setDistractionFree true
            @app.d.preview.update()

    show: ->
        @app.d.$el.id = ''
        @$el.id = 'currentFile'

        @app.d.cm.refresh()
        @app.d.cm.focus()

    save: ->
        alert 'save'

        false # stop event