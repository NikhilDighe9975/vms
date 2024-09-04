import { FastifyInstance } from 'fastify';
import {
    saveRateType,
    getAllRateType,
    getRateTypeById,
    updateRateTypeById,
    deleteRateTypeById,
    
} from '../controllers/rateTypeController';

async function rateTypeRoutes(fastify: FastifyInstance) {
    fastify.post('/', saveRateType);
    fastify.get('/get-all', getAllRateType);
    fastify.get('/:id', getRateTypeById);
    fastify.put('/:id', updateRateTypeById);
    fastify.delete('/:id', deleteRateTypeById);
    
}

export default rateTypeRoutes;
