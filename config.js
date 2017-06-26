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
        '/api/teams/create',
        '/teams/:teamName',
        '/api/teams',
        '/creatteam',
        '/api',
        '/'
    ]
};