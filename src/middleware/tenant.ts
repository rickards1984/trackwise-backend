import type { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express { interface Request { tenantSlug?: string } }
}

export function tenantResolver(req: Request, _res: Response, next: NextFunction) {
  // Resolve from subdomain or header for now; refine later
  const host = req.headers.host || '';
  const sub = host.split('.')[0];
  req.tenantSlug = (req.header('x-tenant') || sub || 'demo').toLowerCase();
  next();
}