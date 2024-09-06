import express, { Request, Response } from 'express';
import { ExportService } from '../components/exportService';
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
    const { columns, url, excludedColumns, apiKeys } = req.body;

    const data = await ExportService.fetchData({ columns, url, excludedColumns, apiKeys });
    const filteredData = ExportService.filterData(data, columns, excludedColumns);

    if (!filteredData || filteredData.length === 0) {
      return res.status(404).send('No data available for export.');
    }

    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.setHeader('Content-Type', 'text/csv');

    const csvStringifier = new CsvStringifier(filteredData, columns);
    const csvStream = csvStringifier.getCsvStream();
    csvStream.pipe(res);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error exporting CSV');
  }
});

export default router;
