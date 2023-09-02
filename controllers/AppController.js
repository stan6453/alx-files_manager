import redisClient from '../utils/redis';
import mongoClient from '../utils/db';

function getStatus(req, res) {
  res.status(200).json({ redis: redisClient.isAlive(), db: mongoClient.isAlive() });
}

async function getStats(req, res) {
  res.status(200).json({ users: await mongoClient.nbUsers(), files: await mongoClient.nbFiles() });
}

export default { getStatus, getStats };
