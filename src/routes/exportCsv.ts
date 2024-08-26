import { Request, Response, Router } from 'express';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

const router = Router();

router.post('/api/exportCsv', async (req: Request, res: Response) => {
  const { data } = req.body;

  try {
    
    const filePath = path.join(__dirname, 'output.csv');

    
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'error', title: 'Error' },
        { id: 'category', title: 'Category' },
        { id: 'type', title: 'Type' },
        { id: 'setup', title: 'Setup' },
        { id: 'delivery', title: 'Delivery' },
        { id: 'id', title: 'ID' },
        { id: 'lang', title: 'Language' },
        { id: 'safe', title: 'Safe' },
        { id: 'flags', title: 'Flags' },
      ]
    });

    
    const processedData = data.map((item: any) => ({
      ...item,
      flags: JSON.stringify(item.flags)
    }));

    
    await csvWriter.writeRecords(processedData);

    
    res.download(filePath, 'output.csv', (err) => {
      if (err) {
        console.error('Error sending the file', err);
        res.status(500).json({ message: 'Error sending the file', error: err.message });
      }

      
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting the file', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Error exporting CSV', error);
    res.status(500).json({ message: 'Error exporting CSV', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
