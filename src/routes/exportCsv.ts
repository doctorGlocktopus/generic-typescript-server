import express, { Request, Response } from 'express';
import { createObjectCsvStringifier } from 'csv-writer';
import fetch from 'node-fetch';
import { PassThrough } from 'stream';

interface ExportCsvRequestBody {
  columns: string[];
  url: string;
  apiKeys: { key: string; value: string }[];
}

const router = express.Router();

router.post('/api/exportCsv', async (req: Request<{}, {}, ExportCsvRequestBody>, res: Response) => {
  try {
    const { columns, url, apiKeys } = req.body;
    console.log('Received columns:', columns);
    console.log('Received URL:', url);
    console.log('Received API Keys:', apiKeys);

    if (!columns || !url || !Array.isArray(apiKeys)) {
      return res.status(400).send('Invalid request body');
    }

    const headers: Record<string, string> = {};
    apiKeys.forEach(({ key, value }) => {
      if (key && value) headers[key] = value;
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}: Status ${response.status}`);
      return res.status(response.status).send(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).send('Invalid data format or empty data');
    }

    const csvStringifier = createObjectCsvStringifier({
      header: columns.map((column) => ({ id: column, title: column })),
    });

    const passThrough = new PassThrough();
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.setHeader('Content-Type', 'text/csv');

    passThrough.write(csvStringifier.getHeaderString());

    data.forEach((item: any) => {
      const row = columns.reduce((acc: { [key: string]: any }, column: string) => {
        acc[column] = item[column];
        return acc;
      }, {});

      passThrough.write(csvStringifier.stringifyRecords([row]));
    });

    passThrough.end();

    passThrough.pipe(res);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error exporting CSV');
  }
});

export default router;
