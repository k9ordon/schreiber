class App

    constructor: ->
        @dom() 
        @sub() 
        @show()
        @events()

    dom: ->
        @$el = document.querySelector '#app'
        @$loading = document.querySelector '#loading'
 
    sub: ->
        @titlebar = new Titlebar @
        @documents = []

    events: ->
        Mousetrap.bindGlobal 'command+s', @d.save
        Mousetrap.bindGlobal 'command+p', @togglePreview

    show: ->
        @openFile(false, 'welcome.md', 'welcome')
        @$el.classList.remove 'hidden'
        @$loading.classList.add 'hidden'        

    showDocuments: ->
        console.log 'showDocuments'

    togglePreview: ->
        if ! document.body.classList.contains 'preview'
            console.log 'showPreview'
            document.body.classList.add 'preview'
        else
            console.log 'hidePreview'
            document.body.classList.remove 'preview'

        false # stop event

    openFile: (@dId, @title, @text) ->
        @d = new Document @, @dId, @title, @text
        @documents.push @d
        @d.show()

    setDistractionFree : (@bool) ->
        if @bool
            document.body.classList.add 'distractionFree'

    onGapiReady: ->
        @drive = new Drive @