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
        '/api/tournaments/',
        '/api/tournaments/:userID?',
        '/api/teams',
        '/api',
        '/'
    ]
};