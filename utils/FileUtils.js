export function base64DecodeFile(base64String) {
  return Buffer.from(base64String, 'base64');
}

export function processFileDocument(fileDocument) {
  const fileDocumentCopy = { ...fileDocument };
  fileDocumentCopy.id = fileDocumentCopy._id;
  delete fileDocumentCopy._id;
  delete fileDocumentCopy.localPath;
  return fileDocumentCopy;
}

export default { base64DecodeFile, processFileDocument };
