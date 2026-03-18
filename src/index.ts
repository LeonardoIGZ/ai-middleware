import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { env } from './config/env';
import { validateQuery } from './validator';
import { apiKeyAuth } from './middleware/auth';

import { services } from './services/index.services';
import { AIService } from '../types';

const app = express();

app.use(express.json());
app.use(apiKeyAuth);
app.use(helmet());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { error: 'Too many request' } });
app.use(limiter);

// available services
let actualServiceIndex = 0;
let aiServices: AIService[] = services;

// round robin between services
function getNextService(): AIService {
    const service = aiServices[actualServiceIndex];

    if(!service){
        throw new Error('No services available');
    }
    
    actualServiceIndex = (actualServiceIndex + 1) % services.length;
    return service;
}

app.post('/query', async (req, res) => {
    const { message } = req.body;

    // check if message is not empty
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        // get the next service
        let service = getNextService();
        console.log(`Servicio usado: ${service.name}`);
        const query = await service.generateQuery(message);
        const validation = validateQuery(query);

        // check for a valid query
        if (!validation.valid) return res.status(422).json({ error: validation.reason });
        return res.json({ query });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'validation error' });
    }
});

app.listen(Number(env.port), () => console.log(`Middleware running on port ${env.port}`));
