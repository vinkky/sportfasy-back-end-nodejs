var config = {
    release: {
        secret: 'ileveninelevator',
        database: 'mongodb://localhost/release_sportfasydatabase',
        port: '3001',
        allowedUrls: [
            '/api/authenticate',
            '/authenticate',
            '/authenticate/',
            '/login',
            '/api/login',
            '/api/users/registration',
            '/api/tournaments/',
            '/api/tournaments',
            '/api/tournaments/:userID?',
            '/api/teams',
            '/api',
            '/',
            '/users/registration?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZW1haWwiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0Iiwic3VybmFtZSI6ImluaXQiLCJuYW1lIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJ1cGRhdGVkX2F0IjoiaW5pdCIsImNyZWF0ZWRfYXQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJ1cGRhdGVkX2F0Ijp0cnVlLCJjcmVhdGVkX2F0Ijp0cnVlLCJlbWFpbCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInN1cm5hbWUiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfX3YiOjAsInVwZGF0ZWRfYXQiOiIyMDE3LTA3LTA4VDEyOjEyOjI0LjY3NVoiLCJjcmVhdGVkX2F0IjoiMjAxNy0wNy0wOFQxMjoxMjoyNC42NzVaIiwiZW1haWwiOiJyb290QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJG12Nmt3a08yU3B5UTJZdVpxZldnNnVDeXNvejJZT1NBZmduejV5WE9sYWtTeUM2eEhUMmZlIiwic3VybmFtZSI6IlJ1ZGVua292IiwibmFtZSI6Ik1hcmtvcyIsIl9pZCI6IjU5NjBjYzI4ZmFkMjViMzFiNDYyMzAwMSJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNDk5OTMzOTkzLCJleHAiOjE1MDAwMjAzOTN9.wcb-BOBfP_8Iqb-oB_S0N-kFuajLv3CE0Kv3mcswfnI'
        ]
    },
    dev: {
        secret: 'ileveninelevator',
        database: 'mongodb://localhost/sportfasydatabase',
        port: '3000',
        allowedUrls: [
            '/api/authenticate',
            '/authenticate',
            '/authenticate/',
            '/login',
            '/api/login',
            '/api/users/registration',
            '/api/tournaments/',
            '/api/tournaments',
            '/api/tournaments/:userID?',
            '/api/teams',
            '/api',
            '/',
            '/users/registration?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiZW1haWwiOiJpbml0IiwicGFzc3dvcmQiOiJpbml0Iiwic3VybmFtZSI6ImluaXQiLCJuYW1lIjoiaW5pdCIsIl9fdiI6ImluaXQiLCJ1cGRhdGVkX2F0IjoiaW5pdCIsImNyZWF0ZWRfYXQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJ1cGRhdGVkX2F0Ijp0cnVlLCJjcmVhdGVkX2F0Ijp0cnVlLCJlbWFpbCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsInN1cm5hbWUiOnRydWUsIm5hbWUiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfX0sImlzTmV3IjpmYWxzZSwiX2RvYyI6eyJfX3YiOjAsInVwZGF0ZWRfYXQiOiIyMDE3LTA3LTA4VDEyOjEyOjI0LjY3NVoiLCJjcmVhdGVkX2F0IjoiMjAxNy0wNy0wOFQxMjoxMjoyNC42NzVaIiwiZW1haWwiOiJyb290QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJG12Nmt3a08yU3B5UTJZdVpxZldnNnVDeXNvejJZT1NBZmduejV5WE9sYWtTeUM2eEhUMmZlIiwic3VybmFtZSI6IlJ1ZGVua292IiwibmFtZSI6Ik1hcmtvcyIsIl9pZCI6IjU5NjBjYzI4ZmFkMjViMzFiNDYyMzAwMSJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNDk5OTMzOTkzLCJleHAiOjE1MDAwMjAzOTN9.wcb-BOBfP_8Iqb-oB_S0N-kFuajLv3CE0Kv3mcswfnI'
        ]
    }
}

exports.get = function get(env) {
    return config[env] || config.dev;
}