import express from 'express';
import fetchDataRouter from './routes/fetchData';
import exportCsvRouter from './routes/exportCsv';

const app = express();
const port = 3001;

app.use(express.json());

// Use the routes
app.use(fetchDataRouter);
app.use(exportCsvRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
