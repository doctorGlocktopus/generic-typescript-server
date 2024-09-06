import express, { Request, Response } from 'express';
import { ExportService } from '../components/exportService';
import { CsvFormatter } from '../components/CsvFormatter';

interface ExportCsvRequestBody {
  columns: string[];
  url: string;
  excludedColumns: Record<string, boolean>;
  apiKeys: { key: string; value: string }[];
}

const router = express.Router();

router.post('/api/exportCsv', async (req: Request<{}, {}, ExportCsvRequestBody>, res: Response) => {
  try {
    const { columns, url, excludedColumns, apiKeys } = req.body;

    if (!columns || !url || !excludedColumns) {
      return res.status(400).send('Invalid request body. Columns, URL, and excludedColumns are required.');
    }

    const data = await ExportService.fetchData({ columns, url, excludedColumns, apiKeys });
    const filteredData = ExportService.filterData(data, columns, excludedColumns);

    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.setHeader('Content-Type', 'text/csv');

    const csvStream = CsvFormatter.format(filteredData, columns);
    csvStream.pipe(res);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error exporting CSV');
  }
});

export default router;