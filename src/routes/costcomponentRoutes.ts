import { FastifyInstance } from 'fastify';
import { getCostcomponent, createCostcomponent, getCostcomponentById, updateCostcomponent, deleteCostcomponent } from '../controllers/costcomponentController';

async function costcomponentRoute(fastify: FastifyInstance) {
    fastify.post('/cost-component', createCostcomponent);
    fastify.get('/program/:program_id/cost-component', getCostcomponent);
    fastify.get('/program/:program_id/cost-component/:id', getCostcomponentById);
    fastify.put('/cost-component/:id', updateCostcomponent);
    fastify.delete('/program/:program_id/cost-component/:id', deleteCostcomponent);
}
export default costcomponentRoute;
