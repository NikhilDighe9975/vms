import { FastifyInstance } from 'fastify';
import { getGlobalConfig, getGlobalConfigById, createGlobalConfig,updateGlobalConfigFlags, updateGlobalConfig, deleteGlobalConfig } from '../controllers/globalConfigController';

async function globalConfigRoutes(fastify: FastifyInstance) {
    fastify.get('/get-all', getGlobalConfig);
    fastify.get('/:id', getGlobalConfigById);
    fastify.post('/', createGlobalConfig);
    fastify.put('/:id', updateGlobalConfig);
    fastify.put('/global-launch', updateGlobalConfigFlags);
    fastify.delete('/:id', deleteGlobalConfig);
}
export default globalConfigRoutes;
