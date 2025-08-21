const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Monumento API',
        version: '1.0.0',
        description: 'Documentation des endpoints Monumento',
      },
      servers: [
        { url: process.env.API_URL || 'http://localhost:3000/api', description: 'Local' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        },
        schemas: {
          // ✍️ Schémas réutilisables
          LoginRequest: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: { type: 'string', example: 'admin' },
              password: { type: 'string', example: 'admin' }
            }
          },
          LoginResponse: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  userId: { type: 'integer', example: 1 },
                  token: { type: 'string', example: '<jwt>' }
                }
              }
            }
          },
          MonumentCreate: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              title: { type: 'string', example: 'Colisée' },
              country: { type: 'string', example: 'Italie' },
              city: { type: 'string', example: 'Rome' },
              buildYear: { type: 'integer', example: -80 },
              picture: { type: 'string', example: 'https://...' },
              description: { type: 'string' },
              created: { type: 'string', format: 'date-time' }
            }
          },
          RegisterRequest: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: { type: 'string', minLength: 3, example: 'admin' },
              password: { type: 'string', minLength: 6, example: 'Admin#2025' }
            }
          },
          RegisterResponse: {
            type: 'object',
            properties: {
              userName:   { type: 'string', example: 'admin' },
              token:      { type: 'string', example: '<jwt_access_token>' }
            }
          },
          RefreshRequest: {
            type: 'object',
            required: ['refreshToken'],
            properties: {
              refreshToken: { type: 'string', example: '<jwt_refresh_token>' }
            }
          },
          RefreshResponse: {
            type: 'object',
            properties: {
              accessToken: { type: 'string', example: '<jwt_access_token>' }
            }
          },

          ApiError: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: {}
            }
          }
        },
        responses: {
          Unauthorized: {
            description: 'Non authentifié',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          },
          Conflict: {
            description: 'Conflit (unicité violée)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          },
          ValidationError: {
            description: 'Erreur de validation',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          },
          ServerError: {
            description: 'Erreur serveur',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } }
          }
        }
    },
},
    apis: [path.join(__dirname, '../routes/**/*.js')], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    console.log('[swagger] paths détectés :', Object.keys(swaggerSpec.paths || {}));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};