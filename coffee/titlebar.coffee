class Titlebar
    constructor: (@app) ->
        console.log 'Titlebar init'
        @dom()
        @events()

    dom: ->
        @$el = document.querySelector '.titlebar'
        @$title = @$el.querySelector '.title'

    events: ->
        @$el.addEventListener 'mouseover', (e) => console.log 'titlebar hover'