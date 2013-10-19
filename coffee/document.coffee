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
        @info = new Info @app, @
        @preview = new Preview @app, @
        @slides = new Slides @app, @

    dom: ->
        @$src = @$el.querySelector('#src')
        @$preview = @$el.querySelector('#preview')

    createCodeMirror: ->
        config = 
            mode: 'gfm'
            lineNumbers: false
            theme: "schreiber" 
            lineWrapping: true
            matchBrackets: true
            styleSelectedText: true
            styleActiveLine: true
            extraKeys: 
                "Enter": "newlineAndIndentContinueMarkdownList"
            viewportMargin: 1000

        @cm = CodeMirror.fromTextArea @$src, config
        @cm.setValue @text

    events: ->
        @cm.on "change", () ->
            @app.distractionFreeEnter()
            @app.d.info.update()
            @app.d.preview.update()
            @app.d.preview.updateScrollPosition()
            @app.d.slides.update()

        @cm.on "cursorActivity", () ->
            @app.d.info.update()
            @app.d.preview.update()
            @app.d.preview.updateScrollPosition()
            @app.d.slides.update()

        @cm.on "blur", () ->
            @app.distractionFreeLeave()

    show: ->
        @app.d.$el.id = ''
        @$el.id = 'currentFile'

        @app.d.cm.refresh()
        @app.d.cm.focus()

        @app.titlebar.setTitle @title

    save: (e) ->
        e.preventDefault()
        alert 'save'

    getValueWithCursor: ->
        text = @cm.getValue()
        cursor = @cm.getCursor()
        lines = text.split("\n")
        cursorText = ''

        for text, line in lines
            if line == cursor.line
                cursorText += text.substring 0, cursor.ch
                cursorText += "|<span id='cursor'></span>"
                cursorText += text.substring cursor.ch, text.length
                cursorText += "\n"
            else
                cursorText += text + "\n"

        cursorText