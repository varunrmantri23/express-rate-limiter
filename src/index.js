const express = require("express");
const { createRedisClient, connectRedis } = require("./config/redis");
const { rateLimiter } = require("./middleware/rateLimiter");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const client = createRedisClient();

//middleware
app.use(express.json());

app.set("trust proxy", true); //for better and accurate ip detection

app.use(
  rateLimiter(client, {
    maxRequests: 10, //to allow 10 reqs from an ip
    windowSeconds: 60, //within 60 seconds
  })
);

app.get("/", (req, res) => {
  res.send("Server is running! Hey there!");
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test endpoint - rate limited",
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `${req.method} ${req.originalUrl} is not available`,
    availableEndpoints: ["GET /", "GET /test"],
  });
});

app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong",
  });
});

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
