const {
    postRegisterHandler,
    postLoginHandler,
    predictModelHandler,
    inputDataSchema,
    predictPointsHandler,
    activityInputDataSchema,
    GetAllDataHandler,
    DataInputDataSchema
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
        path: '/predictActivity',
        method: 'POST',
        handler: predictPointsHandler,
        options: {
            validate: {
                payload: activityInputDataSchema
            }
        }
    },
    {
        path: '/home',
        method: 'GET',
        handler: GetAllDataHandler,
        // options: {
        //     validate: {
        //         payload: DataInputDataSchema
        //     }
        // }
    },
]

module.exports = routes;