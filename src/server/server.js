const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const { loadModel } = require('../service/loadModel');
const { loadFoodMapping } = require('../service/foodMapping');
const { loadActivityModel } = require('../service/loadActivityModel');
const { loadActivityMapping } = require('../service/activityMapping');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await loadModel();
    await loadFoodMapping();
    await loadActivityModel();
    await loadActivityMapping();

    await server.start();
    console.log('Server berjalan pada %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
