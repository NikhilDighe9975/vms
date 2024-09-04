import { FastifyInstance } from 'fastify';
import {
    createCostComponentMapping,
    updateCostComponentMapping,
    deleteCostComponentMapping,
    getAllCostComponentMapping,
    getCostComponentMappingById
} from '../controllers/costComponentMappingController';

async function costComponentMappingRoutes(fastify: FastifyInstance) {
    fastify.post('/costComponentMapping', async (request, reply) => {
        await createCostComponentMapping(request, reply);
    });
    fastify.put('/costComponentMapping/:id', updateCostComponentMapping);
    fastify.delete('/program/:program_id/costComponentMapping/:id', deleteCostComponentMapping);
    fastify.get('/program/:program_id/costComponentMapping', getAllCostComponentMapping);
    fastify.get('/program/:program_id/costComponentMapping/:id', getCostComponentMappingById);
}

export default costComponentMappingRoutes;
