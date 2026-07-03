import { VercelRequest, VercelResponse } from '@vercel/node';
import uploadHandler from '../api-src/storage/upload';
import publicHandler from '../api-src/storage/public';

// Disable default body parser for image uploads (to proxy raw binary body to upstream)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string;
  if (action === 'upload') {
    return uploadHandler(req, res);
  }
  if (action === 'public') {
    return publicHandler(req, res);
  }
  return res.status(404).json({ success: false, error: 'Storage action not found' });
}
