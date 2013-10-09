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
