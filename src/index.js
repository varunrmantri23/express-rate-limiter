const express = require("express");
const { createRedisClient, connectRedis } = require("./config/redis");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

const client = createRedisClient();

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running! Hey there!");
});

const startServer = async () => {
  try {
    ///connect to redis
    await connectRedis(client);

    //start our server
    app.listen(PORT, () => {
      console.log(`server is running on ${HOSTNAME}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, client };
