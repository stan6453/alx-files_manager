import mongoClient from '../utils/db';
import { sha1HashPassword } from '../utils/security';
import {
  getBasicToken,
  base64Decode,
  saveSession,
  userFromSessionId,
  deleteCurrentSession,
} from '../utils/BasicAuth';

async function getConnect(req, res) {
  // STEP 1: get the Authorization header token
  const token = getBasicToken(req);

  // STEP 2: base64 decode the string
  const emailAndPassword = base64Decode(token);

  // STEP 3: get email and password
  const [email, password] = emailAndPassword.split(':');

  // STEP 4: Verify email and password
  const user = await mongoClient.getUser({ email });
  if (!user || sha1HashPassword(password) !== user.password) return res.status(401).json({ error: 'Unauthorized' });

  // STEP 4: login the user and create a session
  const sessionId = saveSession(user, 24 * 60 * 60);
  return res.status(200).json({ token: sessionId });
}

async function getDisconnect(req, res) {
  const user = await userFromSessionId(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  deleteCurrentSession(req);
  return res.status(204).send('');
}

export default { getConnect, getDisconnect };
