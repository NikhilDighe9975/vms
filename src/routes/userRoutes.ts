import { FastifyInstance } from 'fastify';
import { UserInterface } from '../interfaces/userInterface';
import { getUser, getUserById,getAllUserIDAndUserId, createUser, updateUser, deleteUser, searchUser } from '../controllers/userController';

async function userRoutes(fastify: FastifyInstance) {
    fastify.get('/', getUser);
    fastify.get('/:id', getUserById);
    fastify.post('/',createUser);
    fastify.put('/program/:program_id/user/:id', updateUser);
    fastify.delete('/:id', deleteUser);
    fastify.get('/search-user', searchUser);
    fastify.get('/program/:program_id', getAllUserIDAndUserId);

}
export default userRoutes;
