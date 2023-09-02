
import mongoClient from '../utils/db';

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

  if (file == 'folder'){
    
  }

}

export default { postUpload };