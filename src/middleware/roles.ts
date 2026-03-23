import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const userRoles = req.user?.roles || [];
        const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

        if (!hasAccess) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
        }

        next();
    };
};
