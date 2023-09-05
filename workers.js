import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';
import { promises as fs } from 'fs';
import mongoClient from './utils/db';

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

export function addImageToFileQueue(job) {
  fileQueue.add(job);
}

async function thumbNail(width, path) {
  const imgThumbnail = await imageThumbnail(path, { width });
  return imgThumbnail;
}

fileQueue.process(async (job, done) => {
  const { fileId, userId } = job.data;

  if (!fileId) throw new Error('Missing fileId');
  if (!userId) throw new Error('Missing userId');

  const file = await mongoClient.getFile(
    {
      _id: mongoClient.ObjectId(fileId),
      userId: mongoClient.ObjectId(userId),
    },
  );

  if (!file) throw new Error('File not found');

  const fileName = file.localPath;
  const thumbnail500 = await thumbNail(500, fileName);
  const thumbnail250 = await thumbNail(250, fileName);
  const thumbnail100 = await thumbNail(100, fileName);
  const image500 = `${fileName}_500`;
  const image250 = `${fileName}_250`;
  const image100 = `${fileName}_100`;

  await fs.writeFile(image500, thumbnail500);
  await fs.writeFile(image250, thumbnail250);
  await fs.writeFile(image100, thumbnail100);
  done();
});

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

export function addNewUserToUserQueue(job) {
  userQueue.add(job);
}

userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) throw new Error('Missing userId');
  const newUser = mongoClient.getUser({ _id: mongoClient.ObjectId(userId) });
  if (!newUser) throw new Error('User not found');
  console.log('Welcome <email>!');
  done();
});

export default { addImageToFileQueue, addNewUserToUserQueue };
