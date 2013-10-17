class Info

    constructor: (@app, @d) ->
        @dom()
        @events()

    dom: ->
        @$el = @d.$el.querySelector '.info'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave

    update: ->
        tokens = markdown.parse @d.cm.getValue()
        @$el.innerHTML = '<pre>' + JSON.stringify(tokens, undefined, 2) + '</pre>';
    