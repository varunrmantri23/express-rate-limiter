API Rate Limiter

What I am building:

- building a mini API rate limiter that limits requests from a single IP using sliding window logic. The goal is to allow max 10 requests per IP per 1 minute. (using bucket logic)

Tech Stack Decisions:

- Node.js with Express (simple and effective for APIs)
- Redis for storing request counts (fast, in-memory, perfect for rate limiting)
- JavaScript
- Local Redis setup

Project Structure:

- index.js - main server file with routes and startup logic
- config/redis.js - handles all Redis connection and utility functions
- .env - environment variables (port, redis host/port)
- package.json - dependencies and scripts

my Approach:

1. First we set up basic Express server with Redis connection
2. Server connects to Redis first, then starts listening for requests
3. Proper error handling and environment variable usage
4. Next steps will be building the sliding window rate limiter middleware

How to run:

1. Make sure Redis is running locally (redis-server)
2. npm install
3. npm start (uses nodemon for auto-restart)
4. Server runs on localhost:3000

Current Status:
✓ Basic server setup complete
✓ Redis connection working
✓ Environment configuration done
✓ Project structure organized
⏳ Next: Build rate limiting middleware with sliding window logic

The sliding window approach will use Redis sorted sets with timestamps to track requests per IP and automatically clean up old entries.
