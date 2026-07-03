import { VercelRequest, VercelResponse } from '@vercel/node';
import devicesHandler from '../api-src/admin/devices';
import licensesHandler from '../api-src/admin/licenses';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const resource = req.query.resource as string;
  if (resource === 'devices') {
    return devicesHandler(req, res);
  }
  if (resource === 'licenses') {
    return licensesHandler(req, res);
  }
  return res.status(404).json({ success: false, error: 'Resource not found' });
}
