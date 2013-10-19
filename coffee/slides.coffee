class Slides

    constructor: (@app, @d) ->
        @dom()
        @events()

    dom: ->
        @$el = @d.$el.querySelector '.slides'

    events: ->
        @$el.addEventListener 'mouseover', @app.distractionFreeLeave

    update: ->
        markupSlides = @d.getValueWithCursor().split("\n---\n")
        htmlSlides = ''

        for markup in markupSlides
            htmlSlides += '<div>' + marked markup + '</div>'
        
        @$el.innerHTML = htmlSlides 

    updateScrollPosition: ->
        @$el.scrollTop = @$el.querySelector('#cursor').offsetTop - (@$el.offsetHeight) / 2;