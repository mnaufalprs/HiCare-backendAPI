const {
    postRegisterHandler,
    postLoginHandler,
    predictModelHandler,
    inputDataSchema,
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
    },
    {
        path: '/predict',
        method: 'POST',
        handler: predictModelHandler,
        options: {
            validate: {
                payload: inputDataSchema
            }
        }
    }
]

module.exports = routes;