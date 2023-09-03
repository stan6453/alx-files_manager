import { env } from 'process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { v4 as getUniqueId } from 'uuid';
import mongoClient from '../utils/db';
import { base64DecodeFile, processFileDocument } from '../utils/FileUtils';

async function postUpload(req, res) {
  const acceptedFileTypes = ['folder', 'file', 'image'];
  const {
    name, type, parentId = 0, isPublic = false, data = null,
  } = req.body;

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
    fileMetadata.localPath = `${storageDirectory}/${getUniqueId()}`;
    const buffer = base64DecodeFile(data);
    writeFileSync(fileMetadata.localPath, buffer);
  }

  const result = await mongoClient.addNewFile(fileMetadata);

  // Return some info about the created file to user
  const createdFile = processFileDocument(result.ops[0]);
  return res.status(201).json(createdFile);
}

async function getShow(req, res) {
  const { id: fileId } = req.params;
  const { _id: userId } = req.appUser;
  let file = await mongoClient.getFile({ _id: mongoClient.ObjectId(fileId), userId });
  if (!file) return res.status(404).json({ error: 'Not found' });
  file = processFileDocument(file);
  return res.status(200).json(file);
}

async function getIndex(req, res) {
  const { parentId = 0, page = 0 } = req.query;
  const { _id: userId } = req.appUser;

  let mongodbQuery = { userId };

  if (parentId !== 0) {
    const parentFolder = await mongoClient.getFile({ _id: mongoClient.ObjectId(parentId) });
    if (!parentFolder || parentFolder.type !== 'folder') return res.status(200).json([]);

    mongodbQuery = { userId, parentId };
  }

  const files = await mongoClient.getFilesWithPagination(mongodbQuery, page, 20);
  const processedFiles = [];
  for (const file of files) {
    processedFiles.push(processFileDocument(file));
  }
  return res.status(200).json(processedFiles);
}

export default { postUpload, getShow, getIndex };
