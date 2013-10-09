class Titlebar

    constructor: (@app) ->
        @dom()
        @events()

    dom: ->
        @$el = document.querySelector '.titlebar'
        @$title = @$el.querySelector '.title'
        @$toPreview = @$el.querySelector '#toPreview'
        @$toDocuments = @$el.querySelector '#toDocuments'

    events: ->
        @$toPreview.addEventListener 'click', (e) => @app.showPreview()
        @$toDocuments.addEventListener 'click', (e) => @app.showDocuments()

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
class App

    constructor: ->
        @dom() 
        @sub() 
        @show()
        @openFile(false, 'welcome.md', 'welcome')

    dom: ->
        @$el = document.querySelector '#app'
        @$loading = document.querySelector '#loading'

    sub: ->
        @titlebar = new Titlebar @
        @documents = []

    show: ->
        @$el.classList.remove 'hidden'
        @$loading.classList.add 'hidden'        

    showDocuments: ->
        console.log 'showDocuments'

    showPreview: ->
        console.log 'showPreview'

    openFile: (@dId, @title, @text) ->
        @d = new Document @, @dId, @title, @text
        @documents.push @d
        @d.show()

setTimeout (-> window.app = new App), 100