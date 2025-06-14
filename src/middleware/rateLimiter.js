//main middleware to handle rate limiting

//uses sliding window - Requests in current window + requests in the previous window * overlap percentage of the rolling window and previous window
// limits requests per IP using Redis sorted sets with timestamps

const rateLimiter = (client, options = {}) => {
  const maxRequests = options.maxRequests || 10;
  const windowSeconds = options.windowSeconds || 60;

  return async (req, res, next) => {
    try {
      const clientIp = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || "unknown";
      const key = `ip_is:${clientIp}`;
      const now = Date.now(); //to get current time with accuracy in ms
      const start = now - windowSeconds * 1000;

      //before counting curr reqs, lets remove old expired ones
      await client.zRemRangeByScore(key, 0, start); //from 0 to before our start
      const requestCount = await client.zCard(key);

      // check limit
      if (requestCount >= maxRequests) {
        //add headers to guide better 
        res.set({
          'X-RateLimit-Limit': maxRequests,
          'Retry-After': windowSeconds
        });
        
        //above maxreq, we throw 429
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: `max ${maxRequests} requests per ${windowSeconds} seconds`,
          retryAfter: windowSeconds,
          currentCount: requestCount, //to test the working
        });
      }

      //if valid req, addkey with timestamp as score
      await client.zAdd(key, {
        score: now,
        value: `${now}`,
      });

      //expire
      await client.expire(key, windowSeconds);

      next();
    } catch (error) {
      console.log("Rate Limiting Error", error);
      next(); // even if redis issues, continue, or our api breaks
    }
  };
};

module.exports = { rateLimiter };
