const redis = require("redis");

const isRedisReady = (client) => {
  return client.isReady;
};

const createRedisClient = () => {
  const client = redis.createClient({
    socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  }
    // url: process.env.REDIS_URL, //if using a url we can uncomment
  });

  client.on("error", (err) => {
    console.error("redis client error:", err);
  });

  client.on("disconnect", () => {
    console.error("redis client disconnected");
  });

  return client;
};

const connectRedis = async (client) => {
  try {
    if (isRedisReady(client)) {
      //already connected to client
      console.log("redis is already connected");
      return;
    }
    await client.connect();
    console.log("connected to redis");
  } catch (error) {
    console.error("error connecting to redis:", error);
    throw error;
  }
};

module.exports = {
  createRedisClient,
  connectRedis,
  isRedisReady,
};
