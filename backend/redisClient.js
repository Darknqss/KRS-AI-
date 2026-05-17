require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch(e) {
    console.error('Redis connection failed:', e);
  }
})();

module.exports = redisClient;
