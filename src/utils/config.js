const config = {
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  }
};

module.exports = config;