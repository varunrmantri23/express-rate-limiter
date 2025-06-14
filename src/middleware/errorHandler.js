const errorHandler = (error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong"
  });
};

module.exports = { errorHandler };