class App
    name: 'myApp'
    # titlebar: new Titlebar
    
    constructor: ->
        @init()
        
    init: ->
        console.log ['app init', @]
        @titlebar = new Titlebar(@)

    beep: ->
        console.log 'beep'


class Titlebar

    constructor: (@app) ->
        console.log ['titlebar init', @]
        @dom() 
        @events()

    dom: ->
        @$el = document.querySelector 'body'

    events: ->
        console.log 'events', @$el
        @$el.addEventListener 'click', (e) => @app.beep() 
       
app = window.app = new App