//we can also have different rate limiting policies for different kinds of routes
const configs = {
  strict: { maxRequests: 5, windowSeconds: 60 }, //for sensitive endpoints
  standard: { maxRequests: 10, windowSeconds: 60 }, //for general
  lenient: { maxRequests: 20, windowSeconds: 60 } //for public endpoints
};

module.exports = { configs };