import mongoClient from '../utils/db';
import { sha1HashPassword } from '../utils/security';

async function postNew(req, res){
  const {email, password} = req.body;

  if (!email) return res.status(400).send({error:'Missing email'});
  if (!password) return res.status(400).send({error:"Missing password"});
  if (await mongoClient.nbUsers({email})) return res.status(400).send({error:"Already exist"});

  const hashedPassword = sha1HashPassword(password);
  const newUser = {email, password:hashedPassword};

  const result = await mongoClient.addNewUser(newUser);
  res.status(201).json({email, id:result.insertedId})
}


export default {postNew};