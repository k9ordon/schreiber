class Drive
    constructor: ->
        @token = false
        @authParams = {
            immediate: false
            scope: 'https://www.googleapis.com/auth/drive'
            client_id: '140224327941-54e8c7refmj3697retgf3c6ed8lcj1dp.apps.googleusercontent.com'
        }
        @authorize()

    authorize: ->
        console.log 'Drive:authorize'
        gapi.auth.authorize @authParams, (auth) ->
            console.log 'Authorize Callback', auth
            
            return app.drive.onAuthorizeReady(auth) if auth != null

            app.drive.authParams.immediate = false
            gapi.auth.authorize app.drive.authParams, (auth) ->
                return app.drive.onAuthorizeReady(auth) if auth

            return app.drive.onOffline(auth)

    onAuthorizeReady: (auth) ->
        console.log 'auth ready', auth
        if(!auth)
            console.log 'not authorized'
            return false

        console.log 'logout url: ', 'https://accounts.google.com/o/oauth2/revoke?token=' + auth.access_token;

        @token = auth.access_token


    onOffline: (auth) ->
        console.log 'offline mode', auth

    getDocuments: ->
        