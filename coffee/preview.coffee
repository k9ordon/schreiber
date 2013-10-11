class Preview

    constructor: (@app, @file) ->
        @dom()

    dom: ->
        @$el = @file.$el.querySelector '.preview'

    update: ->
        console.log 'preview upadte'