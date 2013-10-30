document.body.style.background = 'red'

receiveMessage = (e, msg) => 
    window.appWindow = event.source
    window.appOrigin = event.origin

    console.log 'receiveMessage', e, window.appWindow, window.appOrigin
    appWindow.postMessage {location: window.location.href}, appOrigin

window.addEventListener 'message', receiveMessage
console.log 'init'