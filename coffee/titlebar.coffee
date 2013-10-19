class Titlebar

    constructor: (@app) ->
        @dom()
        @events()

    dom: ->
        @$el = document.querySelector '.titlebar'
        @$title = @$el.querySelector '.title'
        @$toPreview = @$el.querySelector '#toPreview'
        @$toSlides = @$el.querySelector '#toSlides'
        @$toDocuments = @$el.querySelector '#toDocuments'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave
        @$toPreview.addEventListener 'click', @app.togglePreview
        @$toSlides.addEventListener 'click', @app.toggleSlides
        @$toDocuments.addEventListener 'click', @app.toggleDocuments

    setTitle: (filename) ->
        @$title.innerHTML = filename