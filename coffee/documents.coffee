class Documents

    constructor: (@app) ->
        events()

    dom: ->
        @$el = document.querySelector '#fileBrowser'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave