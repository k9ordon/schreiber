class Info

    constructor: (@d) ->
        @dom()

    dom: ->
        @$el = @d.$el.querySelector '.info'

    update: ->
        tokens = markdown.parse @d.cm.getValue()
        @$el.innerHTML = '<pre>' + JSON.stringify(tokens, undefined, 2) + '</pre>';
    