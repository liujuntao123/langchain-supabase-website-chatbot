import type { NextApiRequest, NextApiResponse } from 'next';
import { runScrape } from '@/scripts/scrape-embed';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    try {
        await runScrape()
        console.log('数据获取成功')
      res.status(200).json({ message: '数据拉取成功' });
        
    } catch (error) {
        console.log('error', error);
      } finally {
        res.status(200).json({ message: '[DONE]' });
        res.end();
      }
}