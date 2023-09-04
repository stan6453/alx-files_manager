import { userFromSessionId } from '../BasicAuth';

export async function authenticateUser(req, res, next) {
  const user = await userFromSessionId(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.appUser = user;
  return next();
}

export async function softAuthenticateUser(req, res, next) {
  // get information on user with credentials,
  // while still allowing users without credentials access.
  const user = await userFromSessionId(req);
  if (user) {
    req.appUser = user;
  }
  return next();
}

export default { softAuthenticateUser, authenticateUser };
