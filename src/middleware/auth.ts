import {Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void{
    const key = req.headers['x-api-key'];

    if(!key || key !== env.appApiKey){
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    next();
};
