import express from 'express';
import cors from 'cors';
import fetchDataRouter from './routes/fetchData';
import exportCsvRouter from './routes/exportCsv';

const app = express();
const port = 3001;
app.use(cors({
    origin: 'http://localhost:3000', // Erlaubt nur Anfragen von diesem Origin
    methods: ['GET', 'POST'],         // Erlaubte HTTP-Methoden
    allowedHeaders: ['Content-Type'], // Erlaubte Header
  }));
app.use(express.json());

// Use the routes
app.use(fetchDataRouter);
app.use(exportCsvRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
