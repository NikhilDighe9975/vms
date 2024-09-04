
import { FastifyInstance } from 'fastify';
import {
    getFeesConfigurationById,
    createFeesConfiguration,
    deleteFeesConfigurationById,
    updateFeesConfigurationById,
    getAllFeesConfigByProgramId,
    advancedSearchFeesConfiguration,
} from '../controllers/feesConfigController';
async function feesConfigurationRoute(fastify: FastifyInstance) {
    fastify.get('/program/:program_id/fees/:id', getFeesConfigurationById);
    fastify.post('/fees', createFeesConfiguration);
    fastify.delete('/program/:program_id/fees/:id', deleteFeesConfigurationById);
    fastify.put('/fees/:id', updateFeesConfigurationById);
    fastify.post('/fees/advance-filter', advancedSearchFeesConfiguration)
    fastify.get('/program/:program_id/fees', getAllFeesConfigByProgramId)
}
export default feesConfigurationRoute;
