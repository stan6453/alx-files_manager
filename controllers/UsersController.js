import mongoClient from '../utils/db';
import { sha1HashPassword } from '../utils/security';
import { userFromSessionId } from '../utils/BasicAuth';
import { addNewUserToUserQueue } from '../workers';

async function postNew(req, res) {
  const { email, password } = req.body;

  if (!email) return res.status(400).send({ error: 'Missing email' });
  if (!password) return res.status(400).send({ error: 'Missing password' });
  if (await mongoClient.nbUsers({ email })) return res.status(400).send({ error: 'Already exist' });

  const hashedPassword = sha1HashPassword(password);
  const newUser = { email, password: hashedPassword };

  const result = await mongoClient.addNewUser(newUser);
  addNewUserToUserQueue({ userId: result.insertedId });
  return res.status(201).json({ email, id: result.insertedId });
}

async function getMe(req, res) {
  const user = await userFromSessionId(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ email: user.email, id: user._id });
}
export default { postNew, getMe };
