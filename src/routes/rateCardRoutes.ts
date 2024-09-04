import { FastifyInstance } from 'fastify';
import {
    saveRateCard,
    getAllRateCard,
    getRateCardById,
    updateRateCardById,
    deleteRateCardById,

} from '../controllers/rateCardController';

async function rateCardRoutes(fastify: FastifyInstance) {
    fastify.post('/program/:program_id/rate_card', saveRateCard);
    fastify.get('/program/:program_id/rate_card/get-all', getAllRateCard);
    fastify.get('/program/:program_id/rate_card/:id', getRateCardById);
    fastify.put('/program/:program_id/rate_card/:id', updateRateCardById);
    fastify.delete('/program/:program_id/rate_card/:id', deleteRateCardById);

}

export default rateCardRoutes;
