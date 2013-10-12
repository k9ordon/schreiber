class App

    constructor: ->
        @dom() 
        @sub() 
        @show()

    dom: ->
        @$el = document.querySelector '#app'
        @$loading = document.querySelector '#loading'
 
    sub: ->
        @titlebar = new Titlebar @
        @documents = []

    show: ->
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

    setDistractionFree : (@bool) ->
        if @bool
            document.body.classList.add 'distractionFree'

    onGapiReady: ->
        @drive = new Drive @