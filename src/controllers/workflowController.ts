import { FastifyRequest, FastifyReply } from 'fastify';
import WorkFlow from '../models/workflowModel';
import { WorkflowData } from '../interfaces/workflowInterface';
import { baseSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';

export const createWorkflow = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name } = request.body as WorkflowData;
        const existingWorkflow = await WorkFlow.findOne({
            where: { name: name }
        });

        if (existingWorkflow) {
            return reply.status(400).send({
                status_code: 400,
                message: 'A workflow with the same name already exists',
                trace_id: generateCustomUUID(),
            });
        }
        const workflowDataPayload = request.body as Omit<WorkflowData, '_id'>;
        const workflowData: any = await WorkFlow.create(workflowDataPayload);
        reply.status(201).send({
            status_code: 201,
            workflow: {
                id: workflowData?.id,
                name: workflowData?.name,
            },
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error while creating workflow', error, trace_id: generateCustomUUID() });
    }
};

export const updateWorkflow = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const workflowData = request.body as WorkflowData;
    try {
        const data = await WorkFlow.findByPk(id);
        if (data) {
            await data.update(workflowData);
            reply.status(201).send({
                status_code: 201,
                workflow: { id: id },
                trace_id: generateCustomUUID(),
                message: 'workflow updated successfully.',
            });
        } else {
            reply.status(200).send({ message: 'Workflow not found.' });
        }
    } catch (error) {
        reply.status(500).send({ message: ' An error occurred while updating the workflow', error, trace_id: generateCustomUUID() });
    }
}

export const deleteWorkflow = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const data = await WorkFlow.findOne({
            where: { id, program_id, is_deleted: false },
        });

        if (!data) {
            return reply.status(200).send({ message: 'workflow data not found' });
        }

        await data.update({ is_enabled: false, is_deleted: true });
        reply.status(200).send({
            status_code: 200,
            Workflow_id: id,
            trace_id: generateCustomUUID(),
            message: 'workflow Deleted Successfully'
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error deleting workflow data', error, trace_id: generateCustomUUID() });
    }
}

export async function getAllWorkflows(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['name', 'is_enabled'];
    const responseFields = ['id', 'program_id', 'name', 'placement_order', 'is_enabled', 'modified_on', 'flow_type', 'config', 'levels'];
    return baseSearch(request, reply, WorkFlow, searchFields, responseFields);
}

export async function getWorkflowById(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const item = await WorkFlow.findOne({
            where: { id, program_id }
        });
        if (item) {
            reply.status(200).send({
                statusCode: 200,
                work_flows: item,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(404).send({ message: 'workflow data not found', workflow: [] });
        }
    } catch (error) {
        reply.status(500).send({ message: 'An error occurred while fetching workflow datas', error });
    }
}
