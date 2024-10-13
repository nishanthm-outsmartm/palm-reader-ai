import { RateLimiter } from 'limiter';

// Allow 10 requests per IP per minute
const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true
});

export default limiter;