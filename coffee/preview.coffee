class Preview

    constructor: (@app, @file) ->
        @dom()

    dom: ->
        @$el = @file.$el.querySelector '.preview'

    update: ->
        console.log 'preview upadte', @app.d.getValueWithCursor()
        @$el.innerHTML = marked @app.d.getValueWithCursor()

    updateScrollPosition: ->
        @$el.scrollTop = @$el.querySelector('#cursor').offsetTop - (@$el.offsetHeight) / 2;