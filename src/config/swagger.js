const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Currículo Express API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de currículos com Express e PostgreSQL',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Onde o Swagger vai buscar as anotações das rotas
};

const specs = swaggerJsdoc(options);
module.exports = specs;