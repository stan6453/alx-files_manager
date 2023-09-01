import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.isConnected = true;

    this.client.on("error", function (err) {
      this.isConnected = false;
      console.log(err);
    });

    this.client.on('connected', function () {
      this.isConnected = true;
    });

  }

  isAlive() {
    return this.isConnected
  }

  async get(key) {
    return await this.getAsync(key);
  }

  async set(key, value, durationInSeconds) {
    this.client.set(key, value, 'EX', durationInSeconds)
  }

  async del(key) {
    this.client.del(key)
  }
}

export default new RedisClient()