import 'dotenv/config';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';

const app = express();
app.use(express.static('build/renderer/client'));

// @ts-expect-error - the file might not exist yet but it will
const build = await import('build/renderer/server/remix.js');

app.all('*', createRequestHandler({ build }));

const port = process.env.PORT || 3388;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
