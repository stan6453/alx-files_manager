import { MongoClient, ObjectId } from 'mongodb';
import { env } from 'process';

class DBClient {
  constructor(host = '127.0.0.1', port = 27017, database = 'files_manager') {
    this.host = host;
    this.port = port;
    this.database = database;
    this.url = `mongodb://${this.host}:${this.port}`;
    this.isConnected = false;
    this.ObjectId = ObjectId;

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

  async nbUsers(query = {}) {
    try {
      return await this.db.collection('users').countDocuments(query);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async addNewUser(user) {
    try {
      return await this.db.collection('users').insertOne(user);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async getUser(query) {
    try {
      return await this.db.collection('users').findOne(query);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async getFile(query) {
    try {
      return await this.db.collection('files').findOne(query);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async getFilesWithPagination(query, pageNumber, pageSize) {
    const skip = pageNumber * pageSize;

    try {
      return await this.db.collection('files').aggregate([
        { $match: query },
        { $skip: skip },
        { $limit: pageSize },
      ]).toArray();
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async addNewFile(file) {
    try {
      return await this.db.collection('files').insertOne(file);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }

  async replaceFile(filter, replacement) {
    try {
      return await this.db.collection('files').replaceOne(filter, replacement);
    } catch (error) {
      console.log(error);
    }
    return undefined;
  }
}

export default new DBClient(env.DB_HOST, env.DB_PORT, env.DB_DATABASE);
