import { FastifyRequest, FastifyReply } from 'fastify';
import costComponentGroup from '../models/costComponentGroupModel';
import { costComponentGroupData } from '../interfaces/costComponentGroupInterface';
import costComponentMapping from '../models/costComponentMappingModel';
import { baseSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';

export const createCostComponentGroup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { name, cost_component_ids, program_id } = request.body as costComponentGroupData;
        const existingWorkflow = await costComponentGroup.findOne({
            where: { name: name }
        });

        if (existingWorkflow) {
            return reply.status(400).send({
                status_code: 400,
                message: 'A Group with the same name already exists',
                trace_id: generateCustomUUID(),
            });
        }

        for (const costComponentId of cost_component_ids) {
            await costComponentMapping.create({
                program_id,
                is_enabled: true,
                cost_component_id: costComponentId,
                is_deleted: false,
            });
        }

        const costComponentGroupPayload = request.body as Omit<costComponentGroupData, '_id'>;
        const costComponentGroupData: any = await costComponentGroup.create(costComponentGroupPayload);
        reply.status(201).send({
            status_code: 201,
            costComponentGroup: {
                id: costComponentGroupData?.id,
                name: costComponentGroupData?.name,
            },
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error while creating Group', error, trace_id: generateCustomUUID() });
    }
};

export const updateCostComponentGroup = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const costComponentGroupData = request.body as costComponentGroupData;
    try {
        const data = await costComponentGroup.findByPk(id);
        if (data) {
            await data.update(costComponentGroupData);
            reply.status(201).send({
                status_code: 201,
                costComponentGroup: { id: id },
                trace_id: generateCustomUUID(),
                message: 'Group updated successfully.',
            });
        } else {
            reply.status(200).send({ message: 'Group not found.' });
        }
    } catch (error) {
        reply.status(500).send({ message: ' An error occurred while updating the Group', error, trace_id: generateCustomUUID() });
    }
}

export const deleteCostComponentGroup = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const data = await costComponentGroup.findOne({
            where: { id, program_id, is_deleted: false },
        });

        if (!data) {
            return reply.status(200).send({ message: 'Group data not found' });
        }

        await data.update({ is_enabled: false, is_deleted: true });
        reply.status(200).send({
            status_code: 200,
            cost_component_group_id: id,
            trace_id: generateCustomUUID(),
            message: 'Group Deleted Successfully'
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error deleting Group data', error, trace_id: generateCustomUUID() });
    }
}

export async function getAllCostComponentGroups(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['name', 'is_enabled'];
    const responseFields = ['id', 'program_id', 'name', 'is_enabled', 'cost_component_ids', 'meta_data'];
    return baseSearch(request, reply, costComponentGroup, searchFields, responseFields);
}

export async function getCostComponentGroupById(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const item = await costComponentGroup.findOne({
            where: { id, program_id }
        });
        if (item) {
            reply.status(200).send({
                statusCode: 200,
                costComponentGroup: item,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: 'Group data not found', costComponentGroup: [] });
        }
    } catch (error) {
        reply.status(500).send({ message: 'An error occurred while fetching Group data', error });
    }
}
