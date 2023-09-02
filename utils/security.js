import crypto from 'crypto';

function sha1HashPassword(plaintextPassword) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(plaintextPassword, 'utf8');
  return sha1.digest('hex');
}

exports.sha1HashPassword = sha1HashPassword;
