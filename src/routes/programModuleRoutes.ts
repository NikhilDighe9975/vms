import { FastifyInstance } from 'fastify';
import { getProgramModuleById } from '../controllers/programModuleController';

async function programModuleRoutes(fastify: FastifyInstance) {
  fastify.get('/:id', getProgramModuleById);
}

export default programModuleRoutes;