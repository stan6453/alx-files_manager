import { MongoClient } from "mongodb";
import { env } from 'process';

class DBClient {
  constructor(host = '127.0.0.1', port = 27017, database = 'files_manager') {
    this.host = host;
    this.port = port;
    this.database = database;
    this.url = `mongodb://${this.host}:${this.port}`;
    this.isConnected = false;

    this.client = new MongoClient(this.url);
    this.client.connect()
      .then(() => {
        this.isConnected = true;
        this.db = this.client.db(this.database);

        this.client.on('close', () => {
          this.isConnected = false;
        });

        this.client.on('reconnect', () => {
          this.isConnected = true;
        });

      })
      .catch((err) => {
        console.log('could not connect to MongoDB: ', err);
      });

  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    }
    catch (error) {
      console.log(error)
    }
  }

  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    }
    catch (error) {
      console.log(error)
    }
  }
}

export default new DBClient(env.DB_HOST, env.DB_PORT, env.DB_DATABASE);