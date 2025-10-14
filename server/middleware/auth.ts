import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { isTokenBlacklisted } from '../utils/tokenBlacklist';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: "Access token required" });
        return;
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
        res.status(401).json({ message: "Token has been invalidated" });
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};