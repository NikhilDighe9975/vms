import { FastifyInstance } from 'fastify';
import {
    getWorkLocationById,
    createWorkLocation,
    updateWorkLocation,
    deleteWorkLocationById,
    getAllWorkLocations
} from '../controllers/workLocationController';

async function workLocationRoutes(fastify: FastifyInstance) {
    fastify.post('/work-location', createWorkLocation);
    fastify.get('/program/:program_id/work-location', getAllWorkLocations)
    fastify.get('/program/:program_id/work-location/:id', getWorkLocationById);
    fastify.put('/work-location/:id', updateWorkLocation);
    fastify.delete('/program/:program_id/work-location/:id', deleteWorkLocationById);
}
export default workLocationRoutes;