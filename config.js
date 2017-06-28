module.exports = {

    'secret': 'ileveninelevator',
    'database': 'mongodb://localhost/sportfasydatabase',
    'allowedUrls': [
        '/api/authenticate',
        '/authenticate',
        '/authenticate/',
        '/login',
        '/api/login',
        '/api/users/registration',
        '/api/tournaments',
        '/api/teams',
        //'/api/teams/zalgiris', // get by one for testing purpose
        '/api',
        '/'
    ]
};