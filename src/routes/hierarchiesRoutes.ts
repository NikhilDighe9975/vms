import { FastifyInstance } from 'fastify';
import {hierarchiesData} from "../interfaces/hierarchiesInterface";
import { getHierarchiesById, createHierarchies, updateHierarchies, deleteHierarchies, advancedSearchHierarchies,searchHierarchies,
    getHierarchiesByProgram,getHierarchies} from '../controllers/hierarchiesController';

async function hierarchiesRoutes(fastify: FastifyInstance) {
    fastify.get('/program/:program_id/hierarchies/:id', getHierarchiesById);
    fastify.post('/hierarchies', async (request, reply) => createHierarchies(request.body as hierarchiesData, reply));
    fastify.put('/hierarchies/:id', updateHierarchies);
    fastify.delete('/hierarchies/:id', deleteHierarchies);
    fastify.get('/program/:program_id/hierarchies/', searchHierarchies);
    fastify.post('/program/:program_id/hierarchies/advance_search', advancedSearchHierarchies);
    fastify.get('/program/:program_id/hierarchies', getHierarchiesByProgram);
    fastify.get('/program/:program_id/hierarchies/get-all', getHierarchies);
}
export default hierarchiesRoutes;
