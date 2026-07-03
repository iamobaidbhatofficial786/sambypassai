import { VercelRequest, VercelResponse } from '@vercel/node';
import activateHandler from '../api-src/license/activate';
import createHandler from '../api-src/license/create';
import deactivateHandler from '../api-src/license/deactivate';
import heartbeatHandler from '../api-src/license/heartbeat';
import resetDeviceHandler from '../api-src/license/reset-device';
import statusHandler from '../api-src/license/status';
import validateHandler from '../api-src/license/validate';
import verifyHandler from '../api-src/license/verify';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string;
  switch (action) {
    case 'activate':
      return activateHandler(req, res);
    case 'create':
      return createHandler(req, res);
    case 'deactivate':
      return deactivateHandler(req, res);
    case 'heartbeat':
      return heartbeatHandler(req, res);
    case 'reset-device':
      return resetDeviceHandler(req, res);
    case 'status':
      return statusHandler(req, res);
    case 'validate':
      return validateHandler(req, res);
    case 'verify':
      return verifyHandler(req, res);
    default:
      return res.status(404).json({ success: false, error: 'Action not found' });
  }
}
