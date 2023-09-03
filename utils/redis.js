import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.isConnected = false;
    this.client = redis.createClient();
    this.isConnected = true;
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (err) => {
      this.isConnected = false;
      console.log(err);
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    console.log('isConnected: ', this.isConnected);
    console.log('connected: ', this.client.connected);
    return this.isConnected;
  }

  async get(key) {
    return this.getAsync(key);
  }

  async set(key, value, durationInSeconds) {
    this.client.set(key, value, 'EX', durationInSeconds);
  }

  async del(key) {
    this.client.del(key);
  }
}

export default new RedisClient();
