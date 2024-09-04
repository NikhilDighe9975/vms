import { FastifyInstance } from 'fastify';
import { createWorkflow, updateWorkflow, deleteWorkflow, getAllWorkflows, getWorkflowById } from '../controllers/workflowController';

async function WorkflowRoutes(fastify: FastifyInstance) {
    fastify.post('/workflow', async (request, reply) => {
        await createWorkflow(request, reply);
    });
    fastify.put('/workflow/:id', updateWorkflow);
    fastify.delete('/program/:program_id/workflow/:id', deleteWorkflow);
    fastify.get('/program/:program_id/workflow', getAllWorkflows);
    fastify.get('/program/:program_id/workflow/:id', getWorkflowById);
}

export default WorkflowRoutes;
