const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Currículo Express API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://api-curriculum.vercel.app',
      },
    ],
  },
  // Caminho atualizado para a nova pasta
  apis: ['./app/routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;