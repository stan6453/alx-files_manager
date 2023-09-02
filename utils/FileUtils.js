export function base64DecodeFile(base64String) {
  return Buffer.from(base64String, 'base64');
}

export default { base64DecodeFile };
