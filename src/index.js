const express = require("express");
const { createRedisClient, connectRedis } = require("./config/redis");
const { rateLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const apiRoutes = require("./routes/apiRoutes");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const client = createRedisClient();

//middleware
app.use(express.json());

/*for testing, allow X-Forwarded-for from 1 hop*/
app.set("trust proxy", true); 


app.use(
  rateLimiter(client, {
    maxRequests: 10, //to allow 10 reqs from an ip
    windowSeconds: 60, //within 60 seconds
  })
);

app.use('/', apiRoutes);
app.use(errorHandler);


const startServer = async () => {
  try {
    ///connect to redis
    await connectRedis(client);

    //start our server
    app.listen(PORT, () => {
      console.log(`server is running on ${HOSTNAME}:${PORT}`);
      console.log(`rate limiting: 10 requests per minute per IP`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, client };
