import { Request, Response, Router } from 'express';
import fetch, { Headers } from 'node-fetch';

const router = Router();

router.post('/api/fetchData', async (req: Request, res: Response) => {
  const { url, apiKeys } = req.body;
console.log(1)
  try {
    const headers = new Headers();
    apiKeys.forEach(({ key, value }: { key: string; value: string }) => {
      if (key && value) headers.append(key, value);
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ message: 'Error fetching data', error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
