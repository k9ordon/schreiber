class Drive

    @auth_params:
        'client_id' : '140224327941.apps.googleusercontent.com',
        'scope' : [
            'https://www.googleapis.com/auth/drive', 
            'https://www.googleapis.com/auth/userinfo.email'
        ]

    constructor: ->
        @authorize()

    authorize: ->
        gapi.auth.authorize  @auth_params, (auth) -> console.log auth