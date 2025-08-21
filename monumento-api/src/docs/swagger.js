const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Monumento API',
            version: '1.0.0',
            description: 'Documentation de l\'API Monumento',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur local',
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/**/*.js')], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    console.log('[swagger] paths détectés :', Object.keys(swaggerSpec.paths || {}));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};