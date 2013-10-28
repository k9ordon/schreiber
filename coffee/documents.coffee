class Documents

    constructor: (@app) ->
        @instances = []

        @dom()
        @events()

    dom: ->
        @$el = document.querySelector '#fileBrowser'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave

    add: (documentInstance) ->
        @instances.push documentInstance

    get: (idx) -> @instances[idx]