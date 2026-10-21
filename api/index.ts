import type { VercelRequest, VercelResponse } from '@vercel/node';
import apiApp from '../src/api.ts';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return apiApp(req as any, res as any);
}
