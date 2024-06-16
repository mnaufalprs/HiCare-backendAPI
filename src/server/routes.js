const {
    postRegisterHandler,
    postLoginHandler,
    predictModelHandler,
    inputDataSchema,
    predictPointsHandler,
    activityInputDataSchema,
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
    },
    {
        method: 'POST',
        path: '/predictActivity',
        handler: predictPointsHandler,
        options: {
            validate: {
                payload: activityInputDataSchema
            }
        }
    }
]

module.exports = routes;