class App

    constructor: ->
        @dom() 
        @sub() 
        @events()

        @openDocument(false)

        #filepicker.setKey("ArBbG8nVdT6esL691Pkdvz");
        #filepicker.setKey("AQ6PDvMhTTGufITYyDw6fz");
        #filepicker.setWebview(document.querySelector('#filepickerWebview'));

        #console.log('filepicker ready', filepicker);

        ###
        @$webview = document.querySelector('webview')

        window.addEventListener 'message', 
            (e) => console.log('message recived', e.data)

        @$webview.addEventListener 'loadstop', 
            () => 
                console.log 'loadstop', app
                app.$webview.executeScript(
                    { file: "chromewebview.js" }
                )
                app.$webview.contentWindow.postMessage {cmd: 'handshake'}, '*'
        ###
        

    dom: ->
        @$el = document.querySelector '#app'
        @$loading = document.querySelector '#loading'
        @$openPicker = document.querySelector '#openPickerButton'
        @$filepicker = document.querySelector '#filepickerWebview'
 
    sub: ->
        @titlebar = new Titlebar @
        @documents = new Documents @

    events: ->
        #Mousetrap.bindGlobal 'command+s', @d.save
        Mousetrap.bindGlobal 'command+p', @togglePreview
        Mousetrap.bindGlobal 'command+p', @openPicker
        Mousetrap.bindGlobal 'command+v', () -> 
            console.log 'paste!'
            return false
        @$openPicker.addEventListener 'click', @openPicker

    show: ->
        @$el.classList.remove 'hidden'
        @$loading.classList.add 'hidden'        

    showDocuments: ->
        console.log 'showDocuments'

    openPicker: ->

        console.log @
        @$filepicker.classList.add 'active'
        filepicker.getFile(false, { ext: ['.md', '.markdown', '.txt']}, ((InkBlob) => console.log('picked file', InkBlob)))
        ###
        filepicker.pick({
                container: 'modal'
                extensions: ['.md', '.markdown', '.txt']
                services:['GOOGLE_DRIVE', 'GITHUB', 'DROPBOX', 'COMPUTER', 'FTP', 'WEBDAV']
            },
            (InkBlob) -> 
                console.log JSON.stringify(InkBlob)
                app.openDocument(JSON.stringify(InkBlob))
            , (FPError) -> 
                console.log FPError
        )
        ###

    togglePreview: (e) ->
        e.preventDefault()
        if ! document.body.classList.contains 'preview'
            console.log 'showPreview'
            document.body.classList.add 'preview'
        else
            console.log 'hidePreview'
            document.body.classList.remove 'preview'

    toggleSlides: (e) ->
        e.preventDefault()
        if ! document.body.classList.contains 'slides'
            console.log 'showSlides'
            document.body.classList.add 'slides'
        else
            console.log 'hideSlides'
            document.body.classList.remove 'slides'

    openDocument: (InkBlob) ->
        @d = new Document @, InkBlob
        @documents.add(@d)
        @d.show()

    distractionFreeEnter : ->
        document.body.classList.add 'distractionFree'
    
    distractionFreeLeave : ->
        document.body.classList.remove 'distractionFree'

    onGapiReady: ->
        console.log 'onGapiReady'
        @drive = new Drive @
        @show()