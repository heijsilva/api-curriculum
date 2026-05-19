const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        url: 'https://api-curriculum.vercel.app',
        description: 'Servidor Vercel',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = specs;