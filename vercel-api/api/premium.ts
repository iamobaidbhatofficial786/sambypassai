import { VercelRequest, VercelResponse } from '@vercel/node';
import createLovableProjectHandler from '../api-src/premium/create-lovable-project';
import enableCloudHandler from '../api-src/premium/enable-cloud';
import optimizePromptHandler from '../api-src/premium/optimize-prompt';
import proxyCommandHandler from '../api-src/premium/proxy-command';
import publishProjectHandler from '../api-src/premium/publish-project';
import removeWatermarkHandler from '../api-src/premium/remove-watermark';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const action = req.query.action as string;
  switch (action) {
    case 'create-lovable-project':
      return createLovableProjectHandler(req, res);
    case 'enable-cloud':
      return enableCloudHandler(req, res);
    case 'optimize-prompt':
      return optimizePromptHandler(req, res);
    case 'proxy-command':
      return proxyCommandHandler(req, res);
    case 'publish-project':
      return publishProjectHandler(req, res);
    case 'remove-watermark':
      return removeWatermarkHandler(req, res);
    default:
      return res.status(404).json({ success: false, error: 'Premium action not found' });
  }
}
