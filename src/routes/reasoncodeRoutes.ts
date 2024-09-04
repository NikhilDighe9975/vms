import { FastifyInstance } from 'fastify';
import { getReasoncode,getReasoncodeId, updateReasoncode,createReasoncode, deleteReasoncode,  } from '../controllers/reasoncodeController';

async function reasoncodeRoute(fastify: FastifyInstance) {
    fastify.post('/reason-code', createReasoncode);
    fastify.get('/program/:program_id/reason-code', getReasoncode);
    fastify.get('/program/:program_id/reason-code/:id', getReasoncodeId);
    fastify.put('/reason-code/:id', updateReasoncode);
    fastify.delete('/program/:program_id/reason-code/:id', deleteReasoncode);
}

export default reasoncodeRoute;
