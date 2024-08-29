import { Request, Response, Router } from 'express';
import { createObjectCsvStringifier } from 'csv-writer'; // Verwenden Sie csv-writer zum Streamen von CSV-Daten
import { PassThrough } from 'stream';

const router = Router();

interface ExportCsvRequestBody {
  columns: string[];
  data: any[];
}

router.post('/api/exportCsv', (req: Request<{}, {}, ExportCsvRequestBody>, res: Response) => {
  const { columns, data } = req.body;

  if (!Array.isArray(columns) || !Array.isArray(data) || columns.length === 0 || data.length === 0) {
    return res.status(400).json({ message: 'Invalid columns or data provided' });
  }

  const csvStringifier = createObjectCsvStringifier({
    header: columns.map((column: string) => ({ id: column, title: column })),
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
});

export default router;
