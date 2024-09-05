import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import { PassThrough } from 'stream';
import CsvStringifier from '../components/CsvStringifier';

interface ExportCsvRequestBody {
  columns: string[];
  url: string;
  excludedColumns: Record<string, boolean>;
  apiKeys: { key: string; value: string }[];
}

const router = express.Router();

router.post('/api/exportCsv', async (req: Request<{}, {}, ExportCsvRequestBody>, res: Response) => {
  try {
    const { columns, url, excludedColumns, apiKeys } = req.body || {};

    if (!columns || !url || !excludedColumns) {
      return res.status(400).send('Invalid request body. Columns, URL, and excludedColumns are required.');
    }

    const headers: Record<string, string> = {};
    if (apiKeys.length) {
      apiKeys.forEach(({ key, value }) => {
        if (key && value) headers[key] = value;
      });
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}: Status ${response.status}`);
      return res.status(response.status).send(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) {
      return res.status(400).send('Invalid data format or empty data');
    }

    const filteredColumns = columns.filter(col => excludedColumns[col]);

    const passThrough = new PassThrough();
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.setHeader('Content-Type', 'text/csv');

    passThrough.write(filteredColumns.join(',') + '\n');

    dataArray.forEach((item: any) => {
      const recorder = new CsvStringifier(item, filteredColumns.join(','));
      recorder.appendToStream(passThrough, filteredColumns);
    });

    passThrough.end();

    passThrough.pipe(res);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error exporting CSV');
  }
});

export default router;
