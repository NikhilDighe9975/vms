import { FastifyInstance } from 'fastify';
import { getAllTimeZones, getTimeZoneById, createTimeZone, updateTimeZone, deleteTimeZone } from '../controllers/timeZonesController';

async function timeZoneRoutes(fastify: FastifyInstance) {
  fastify.get('/', getAllTimeZones);
  fastify.get('/:id', getTimeZoneById);
  fastify.post('/', createTimeZone);
  fastify.put('/:id', updateTimeZone);
  fastify.delete('/:id', deleteTimeZone);
}

export default timeZoneRoutes;