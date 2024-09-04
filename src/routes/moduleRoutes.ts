import { FastifyInstance } from 'fastify';
import {
  getModule,
  createModule,
  updateModule,
  deleteModule
} from '../controllers/moduleController';

async function moduleRouter(fastify: FastifyInstance) {
  fastify.get('/', getModule);
  fastify.post('/', createModule);
  fastify.put('/:id', updateModule);
  fastify.delete('/:id', deleteModule);
}

export default moduleRouter;