import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import fetchDataRouter from './routes/fetchData';
import exportCsvRouter from './routes/exportCsv';

const app = express();
const port = 3001;
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));
app.use(express.json());
app.use(fileUpload());

app.use(fetchDataRouter);
app.use(exportCsvRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
