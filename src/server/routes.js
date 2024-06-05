const {
    postRegisterHandler,
    postLoginHandler
} = require('../server/handler');

const routes = [
    {
        path: '/register',
        method: 'POST',
        handler: postRegisterHandler,
    },
    {
        path: '/login',
        method: 'POST',
        handler: postLoginHandler,
    }
]

module.exports = routes;