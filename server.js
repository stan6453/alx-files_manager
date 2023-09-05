import { env } from 'process';
import express from 'express';
import router from './routes/index';

const app = express();
const port = env.PORT || 5000;

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

app.use('/', router);

app.listen(port);

export default app;
