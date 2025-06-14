API Rate Limiter

What I built:

A mini API rate limiter that limits requests from a single IP using sliding window logic. Successfully allows max 10 requests per IP per 1 minute with smooth rate limiting.

Tech Stack:

- Node.js with Express (simple and effective for APIs)
- Redis for storing request counts (fast, in-memory, perfect for rate limiting)
- JavaScript
- Local Redis setup
- Sliding window algorithm

Project Structure:

- src/index.js - main server file with routes and startup logic
- src/config/redis.js - handles all Redis connection and utility functions
- src/middleware/rateLimiter.js - core sliding window rate limiting logic
- src/controllers/apiController.js - handles request/response logic
- src/routes/apiRoutes.js - defines API endpoints and routing
- src/config/rateLimitConfig.js - different rate limiting configurations that can be used 
- docs/images/ - documentation assets
- .env - environment variables (port, redis host/port)
- package.json - dependencies and scripts

My Approach:

1. Set up basic Express server with Redis connection
2. Server connects to Redis first, then starts listening for requests
3. Built sliding window rate limiter with timestamps
4. Implemented proper error handling
5. Organized code in modular structure for maintainability

How the Rate Limiter Works:

- Uses Redis sorted sets to store request timestamps per IP
- Automatically removes expired entries older than the time window
- Counts current requests and blocks if limit exceeded
- Adds current request with unique timestamp for tracking
- Returns 429 status with helpful error message
- Includes rate limit headers to guide client behavior

Available Endpoints:

- GET / - Server status and info (lenient: 20 req/min)
- GET /test - Test endpoint to demo rate limiting (standard: 10 req/min)
- GET /sensitive - Sensitive endpoint with strict limiting (strict: 5 req/min)
- Any other route - Returns 404 with available endpoints

How to run:

1. Make sure Redis is running locally (redis-server)
2. npm install
3. npm start (uses nodemon for auto-restart)
4. Server runs on localhost:3000
5. watch "curl -i http://localhost:3000/test" in another terminal and watch the responses



Testing Rate Limiting:

I tested the rate limiter using the watch command to see real-time behavior:

watch "curl -i http://localhost:3000/test"

This command repeatedly hits the endpoint every 2 seconds, showing:
- First 10 requests: Status 200
- 11th+ requests: Status 429 "Rate limit exceeded"
- After 60 seconds: Requests allowed again as window slides

Demo Results:

![Rate Limiting example](./docs/images/demo-1.png)

![Rate Limiting example](./docs/images/demo-2.png)

The rate limiter works perfectly as demonstrated in the screenshot. When testing with the watch command, I could see the rate limiting kick in after 10 requests, returning 429 errors with clear retry information. After waiting for the window to reset, requests were allowed again, proving the sliding window mechanism works correctly.

Current Status:
✓ Basic server setup complete
✓ Redis connection working with proper error handling
✓ Environment configuration done
✓ Project structure organized with controllers and routes
✓ Sliding window rate limiter implemented
✓ Multiple rate limiting tiers (strict, standard, lenient) for future 
✓ Rate limiting middleware working perfectly
✓ Clean, modular code architecture

Key Features:

- Smooth sliding window algorithm
- Automatic cleanup of expired entries for memory efficiency
- Accurate IP detection with proxy support (X-Forwarded-For)
- Helpful rate limit headers guide clients on remaining quota