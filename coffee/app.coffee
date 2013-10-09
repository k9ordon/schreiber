class App

    constructor: ->
        @dom() 
        @sub() 
        @load()

    dom: ->
        @$el = document.querySelector '#app'
        @$loading = document.querySelector '#loading'
 
    sub: ->
        @titlebar = new Titlebar @
        @documents = []

    load: ->
        @openFile(false, 'welcome.md', 'welcome')

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
