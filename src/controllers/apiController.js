const getHome = (req, res) => {
  res.json({
    message: "Server is running! Hello there!",
    // rateLimit: "lenient (20 req/min)",
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
};

const getTest = (req,res) =>{
  res.json({
    message: "Test endpoint - rate limited",
    // rateLimit: "standard (10 req/min)",
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
};

const notFound = (req,res) =>{
  res.status(404).json({
    error: "Endpoint not found",
    message: `${req.method} ${req.originalUrl} is not available`,
    availableEndpoints: ["GET /", "GET /test"],
  });
};


module.exports = {getHome, getTest, notFound};
