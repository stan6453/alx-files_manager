import { v4 as getUniqueId } from 'uuid';
import redisClient from './redis';
import mongoClient from './db';

// BASIC AUTH HELPER FUNCTIONS
export function getBasicToken(req) {
  return req.headers.authorization.replace(/^Basic\s/, '');
}

export function base64Decode(base64String) {
  return Buffer.from(base64String, 'base64').toString('utf8');
}

export function saveSession(user, ttl) {
  const sessionId = getUniqueId();
  redisClient.set(`auth_${sessionId}`, user._id, ttl);
  return sessionId;
}

export async function userFromSessionId(req) {
  const sessionId = req.headers['x-token'];
  const userId = await redisClient.get(`auth_${sessionId}`);
  return mongoClient.getUser({ _id: mongoClient.ObjectId(userId) });
}

export function deleteCurrentSession(req) {
  const sessionId = req.headers['x-token'];
  redisClient.del(`auth_${sessionId}`);
}
