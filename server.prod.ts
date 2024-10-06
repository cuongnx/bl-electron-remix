import 'dotenv/config';
import { createRequestHandler } from '@remix-run/express';
import express from 'express';

const app = express();
app.use(express.static('build/client'));

// @ts-expect-error - the file might not exist yet but it will
const build = await import('build/server/remix.js');

app.all('*', createRequestHandler({ build }));

const port = process.env.PORT || process.env.DEV_PORT;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
