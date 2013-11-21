console.log 'chrome background init'

chrome.app.runtime.onLaunched.addListener(() =>
    screenWidth = screen.availWidth
    screenHeight = screen.availHeight
    width = 500
    height = 500
    chrome.app.window.create('index.html', 
        {
            id: 'main'
            frame: 'none' 
            #minWidth: 320
            bounds: {
                width: width
                height: height
                left: Math.round((screenWidth-width)/2)
                top: Math.round((screenHeight-height)/2)
            }
        }
    )

)