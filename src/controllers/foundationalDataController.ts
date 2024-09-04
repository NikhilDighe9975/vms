import { FastifyRequest, FastifyReply } from "fastify";
import foundationalData from "../models/foundationalDataModel";
import foundationalDataInterface from "../interfaces/foundationalDataInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import { ReturnData } from "./foundationaldatatypesController";
import FoundationalDataTypes from "../models/foundationalDatatypesModel";

export async function getFoundationalData(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['id', 'program_id', 'name', 'is_enabled', 'modified_on', 'manager_id', 'code', 'foundational_data_type_id'];
    const responseFields = ['id', 'program_id', 'name', 'is_enabled', 'modified_on', 'manager_id', 'code', 'foundational_data_type_id'];
    const { program_id } = request.params as { program_id: string };
    const { foundational_data_type_id } = request.query as { foundational_data_type_id: string };

    if (!program_id) {
        return reply.status(400).send({ message: 'Program ID is required' });
    }

    try {
        const data = await ReturnData(request, reply, foundationalData, searchFields, responseFields, program_id);
        let foundationalDataTypeName: any = null;

        if (data && data.items && data.items.length > 0) {
            const foundationalDataTypeId = data.items[0].dataValues.foundational_data_type_id || foundational_data_type_id;
            if (foundationalDataTypeId) {
                const foundationalDataType = await FoundationalDataTypes.findOne({
                    where: { id: foundationalDataTypeId },
                    attributes: ['name'],
                });

                if (foundationalDataType) {
                    foundationalDataTypeName = foundationalDataType.name;
                }
            }

            data.items = data.items.map((item: any) => ({
                ...item.dataValues,
            }));

            reply.status(200).send({
                foundational_data_type_name: foundationalDataTypeName,
                total_records: data.total_records,
                foundational_data: data.items
            });
        } else {
            if (foundational_data_type_id) {
                const foundationalDataType = await FoundationalDataTypes.findOne({
                    where: { id: foundational_data_type_id },
                    attributes: ['name'],
                });

                if (foundationalDataType) {
                    foundationalDataTypeName = foundationalDataType.name;
                }
            }

            reply.status(200).send({
                foundational_data_type_name: foundationalDataTypeName || null,
                total_records: data.total_records,
                foundational_data: []
            });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
}



export async function getFoundationalDataById(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const foundational_data = await foundationalData.findOne({ where: { program_id, id } });
        if (foundational_data) {
            reply.status(200).send({
                status_code: 200,
                message: 'FoundationalData fetch Successfully.',
                trace_id: generateCustomUUID(),
                foundational_data: foundational_data
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'FoundationalData Not Found.',
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching FoundationalData.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export async function createFoundationalData(request: FastifyRequest, reply: FastifyReply) {
    const foundational_data = request.body as foundationalDataInterface;

    try {
        const foundational_Data = await foundationalData.create({ ...foundational_data });
        reply.status(201).send({
            status_code: 201,
            foundational_data_id: foundational_Data.id,
            trace_id: generateCustomUUID(),
            message: 'FoundationalData Created Successfully.',
        });

    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: 'An error occurred while creating FoundationalData.',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}

export async function updateFoundationalData(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    const { program_id, id } = request.params;
    try {
        const [updatedCount] = await foundationalData.update(request.body as foundationalDataInterface, { where: { program_id, id } });
        if (updatedCount > 0) {
            reply.send({
                status_code: 201,
                message: 'FoundationalData updated successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'FoundationalData not found.',
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'Internal Server error',
            trace_id: generateCustomUUID(),
            error
        });
    }
}

export async function deleteFoundationalData(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const foundational_data = await foundationalData.findOne({ where: { program_id, id } });
        if (foundational_data) {
            await foundationalData.update({ is_deleted: true, is_enabled: false }, { where: { program_id, id } });
            reply.status(204).send({
                status_code: 204,
                message: 'FoundationalData deleted successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'FoundationalData not found.'
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while deleting FoundationalData.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}
