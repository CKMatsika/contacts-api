const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'A simple Express API for managing contacts',
      contact: {
        name: 'API Support',
        email: 'support@contactsapi.com'
      }
    },
    servers: [
      {
        url: 'https://contacts-api-thzu.onrender.com',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };