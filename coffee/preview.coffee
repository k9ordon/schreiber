class Preview

    constructor: (@d) ->
        @dom()

    dom: ->
        @$el = @d.$el.querySelector '.preview'

    update: ->
        console.log 'preview upadte', @d.getValueWithCursor()
        @$el.innerHTML = marked @d.getValueWithCursor()

    updateScrollPosition: ->
        @$el.scrollTop = @$el.querySelector('#cursor').offsetTop - (@$el.offsetHeight) / 2;