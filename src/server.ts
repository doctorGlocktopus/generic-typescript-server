import express from 'express';
import cors from 'cors';
import fetchDataRouter from './routes/fetchData';
import exportCsvRouter from './routes/exportCsv';
import exportPdfRouter from './routes/exportPdf';
import path from 'path';

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.use(fetchDataRouter);
app.use(exportCsvRouter);
app.use(exportPdfRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
