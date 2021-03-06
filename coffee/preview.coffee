class Preview

    constructor: (@app, @d) ->
        @dom()
        @events()

    dom: ->
        @$el = @d.$el.querySelector '.preview'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave

    update: ->
        @$el.innerHTML = marked @d.getValueWithCursor()

    updateScrollPosition: ->
        @$el.scrollTop = @$el.querySelector('#cursor').offsetTop - (@$el.offsetHeight) / 2;