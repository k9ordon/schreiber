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
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave
        @$toPreview.addEventListener 'click', @app.togglePreview
        @$toDocuments.addEventListener 'click', @app.toggleDocuments

    setTitle: (filename) ->
        @$title.innerHTML = filename