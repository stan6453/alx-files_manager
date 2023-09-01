import express from 'express';
import router from './routes/index';
import { env } from 'process';

const app = express();
const port = env.PORT || 5000;

app.use('/', router);

app.listen(port);