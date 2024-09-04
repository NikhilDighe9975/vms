import { FastifyRequest, FastifyReply } from 'fastify';
import costComponentMapping from '../models/costComponentMappingModel';
import { costComponentMappingData } from '../interfaces/costComponentMappingInterface';
import { baseSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';

export const createCostComponentMapping = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const costComponentMappingPayload = request.body as Omit<costComponentMappingData, '_id'>;
        const costComponentMappingData: any = await costComponentMapping.create(costComponentMappingPayload);
        reply.status(201).send({
            status_code: 201,
            costComponentGroup: {
                id: costComponentMappingData?.id,
                name: costComponentMappingData?.name,
            },
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error while creating costComponentMapping', error, trace_id: generateCustomUUID() });
    }
};

export const updateCostComponentMapping = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const costComponentMappingData = request.body as costComponentMappingData;
    try {
        const data = await costComponentMapping.findByPk(id);
        if (data) {
            await data.update(costComponentMappingData);
            reply.status(201).send({
                status_code: 201,
                costComponentMapping: { id: id },
                trace_id: generateCustomUUID(),
                message: 'costComponentMapping updated successfully.',
            });
        } else {
            reply.status(404).send({ message: 'costComponentMapping not found.' });
        }
    } catch (error) {
        reply.status(500).send({ message: ' An error occurred while updating the costComponentMapping', error, trace_id: generateCustomUUID() });
    }
}

export const deleteCostComponentMapping = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const data = await costComponentMapping.findOne({
            where: { id, program_id, is_deleted: false },
        });

        if (!data) {
            return reply.status(404).send({ message: 'costComponentMapping data not found' });
        }

        await data.update({ is_enabled: false, is_deleted: true });
        reply.status(200).send({
            status_code: 200,
            cost_component_mapping_id: id,
            trace_id: generateCustomUUID(),
            message: 'costComponentMapping Deleted Successfully'
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error deleting costComponentMapping data', error, trace_id: generateCustomUUID() });
    }
}

export async function getAllCostComponentMapping(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['name', 'is_enabled'];
    const responseFields = ['id', 'program_id', 'is_enabled', 'cost_component_id'];
    return baseSearch(request, reply, costComponentMapping, searchFields, responseFields);
}

export async function getCostComponentMappingById(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const item = await costComponentMapping.findOne({
            where: { id, program_id }
        });
        if (item) {
            reply.status(200).send({
                statusCode: 200,
                CostComponentMapping: item,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(404).send({ message: 'costComponentMapping data not found', CostComponentMapping: [] });
        }
    } catch (error) {
        reply.status(500).send({ message: 'An error occurred while fetching costComponentMapping data', error });
    }
}
