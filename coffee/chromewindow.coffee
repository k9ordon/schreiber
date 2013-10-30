class ChromeWindow
    
    constructor:(@app) ->
        @dom()
        @events()

    dom: ->
        @$windowClose = document.querySelector '#windowClose'
        @$windowMinimize = document.querySelector '#windowMinimize'
        @$windowMaximize = document.querySelector '#windowMaximize'

    events: ->
        Mousetrap.bindGlobal 'command+w', @windowClose
        Mousetrap.bindGlobal 'command+f', @windowFullscreen

        @$windowClose.addEventListener 'click', @windowClose
        @$windowMinimize.addEventListener 'click', @windowMinimize
        @$windowMaximize.addEventListener 'click', @windowMaximize

    closeWindow: ->
        chrome.app.window.current().close()

    minimizeWindow: ->
        chrome.app.window.current().minimize()

    maximizeWindow: ->
        cw = chrome.app.window.current()

        if(cw.isMaximized())
            cw.restore()
            return
        cw.maximize()
        

    fullscreenWindow: ->
        cw = chrome.app.window.current();

        if(cw.isFullscreen())
            cw.restore()
            return
        cw.fullscreen()