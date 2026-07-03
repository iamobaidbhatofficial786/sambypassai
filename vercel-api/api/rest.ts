import { VercelRequest, VercelResponse } from '@vercel/node';
import licensesHandler from '../api-src/rest/licenses';
import notificationsHandler from '../api-src/rest/notifications';
import packagesHandler from '../api-src/rest/packages';
import userRolesHandler from '../api-src/rest/user_roles';
import versionsHandler from '../api-src/rest/versions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const resource = req.query.resource as string;
  switch (resource) {
    case 'licenses':
      return licensesHandler(req, res);
    case 'notifications':
      return notificationsHandler(req, res);
    case 'packages':
      return packagesHandler(req, res);
    case 'user_roles':
      return userRolesHandler(req, res);
    case 'versions':
      return versionsHandler(req, res);
    default:
      return res.status(404).json({ success: false, error: 'Resource not found' });
  }
}
