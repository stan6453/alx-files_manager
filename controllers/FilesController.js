import { env } from 'process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 as getUniqueId } from 'uuid';
import mongoClient from '../utils/db';
import { base64DecodeFile } from '../utils/FileUtils';

export async function postUpload(req, res) {
  const acceptedFileTypes = ['folder', 'file', 'image'];
  const { name, type, parentId = 0, isPublic = false, data = null } = req.body;

  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!type || !acceptedFileTypes.includes(type)) return res.status(400).json({ error: 'Missing type' });
  if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

  if (parentId !== 0) {
    const parent = await mongoClient.getFile({ _id: mongoClient.ObjectId(parentId) });
    if (!parent) return res.status(400).json({ error: 'Parent not found' });
    if (parent.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
  }

  const fileMetadata = {
    name,
    type,
    parentId,
    isPublic,
    userId: req.appUser._id,
  };

  if (type !== 'folder') {
    const storageDirectory = env.FOLDER_PATH || '/tmp/files_manager';
    if (!existsSync(storageDirectory)) mkdirSync(storageDirectory);
    fileMetadata.localPath = storageDirectory + '/' + getUniqueId();
    const buffer = base64DecodeFile(data)
    writeFileSync(fileMetadata.localPath, buffer);
  }

  const result = await mongoClient.addNewFile(fileMetadata);
  const createdFile = result.ops[0];
  createdFile.id = createdFile._id;
  delete createdFile._id;
  delete createdFile.localPath;
  return res.status(201).json(createdFile);

}

export default { postUpload };