const swaggerJsDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'FamilyCare Backend',
        version: '1.0.0',
        description: 'REST APIs for FamilyCare Backend'
    },
    servers: [ 
        {
            url: 'http://localhost:3000'
        } 
    ]
};

const swaggerOptions = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpec;