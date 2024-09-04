import { FastifyInstance } from 'fastify';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';

async function EventRoutes(fastify: FastifyInstance) {
    fastify.post('/supporting-text-event', createEvent);
    fastify.get('/program/:program_id/supporting-text-event', getAllEvents);
    fastify.get('/program/:program_id/supporting-text-event/:id', getEventById);
    fastify.put('/program/:program_id/supporting-text-event/:id', updateEvent);
    fastify.delete('/program/:program_id/supporting-text-event/:id', deleteEvent);
}
export default EventRoutes;