import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Golden Raspberry Awards API',
      version: '1.0.0',
      description: 'API para análise de Prêmios Golden Raspberry Awards (Razzies)',
      contact: {
        name: 'FSB Holding',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        ProducerInterval: {
          type: 'object',
          properties: {
            producer: {
              type: 'string',
              example: 'Bo Derek',
            },
            interval: {
              type: 'integer',
              example: 6,
            },
            previousWin: {
              type: 'integer',
              example: 1984,
            },
            followingWin: {
              type: 'integer',
              example: 1990,
            },
          },
          required: ['producer', 'interval', 'previousWin', 'followingWin'],
        },
        IntervalsResponse: {
          type: 'object',
          properties: {
            min: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProducerInterval',
              },
            },
            max: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ProducerInterval',
              },
            },
          },
          required: ['min', 'max'],
        },
        AIInteraction: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2026-10-22T12:00:00.000Z',
            },
            tool_name: {
              type: 'string',
              example: 'Claude Code',
            },
            skill_name: {
              type: 'string',
              example: 'brainstorming',
            },
            prompt: {
              type: 'string',
              example: 'Plan the API design',
            },
            result: {
              type: 'string',
              example: 'Design approved',
            },
          },
          required: ['id', 'timestamp', 'tool_name', 'skill_name', 'prompt', 'result'],
        },
        AIInteractionsResponse: {
          type: 'object',
          properties: {
            interactions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AIInteraction',
              },
            },
          },
          required: ['interactions'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
