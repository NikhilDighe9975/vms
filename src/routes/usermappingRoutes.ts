import { FastifyInstance } from 'fastify';
import { getAllUserMappings, getUserMappingById, createUserMappings, updateUserMappingById, deleteUserMappingById, getUserMappings } from '../controllers/usermappingController';
import { UserMappingAttributes } from '../interfaces/usermappingInterface'
export async function userMappingRoutes(fastify: FastifyInstance) {
    fastify.get('/', getAllUserMappings);
    fastify.get('/:id', getUserMappingById);
    fastify.post('/', async (request, reply) => createUserMappings(request.body as UserMappingAttributes, reply));
    fastify.put('/:id', updateUserMappingById);
    fastify.delete('/:id', deleteUserMappingById);
    fastify.get('/getall-usermapping',getUserMappings);
}

export default userMappingRoutes;

