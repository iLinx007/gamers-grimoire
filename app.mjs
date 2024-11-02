import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.send('Game Backlog Tracker');
  });

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${port}`);
});
