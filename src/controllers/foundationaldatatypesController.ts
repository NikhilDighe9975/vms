import { FastifyRequest, FastifyReply } from 'fastify';
import foundationalDataTypes from '../models/foundationalDatatypesModel';
import { foundationalData } from '../interfaces/foundationaldatatypesInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import { Op } from 'sequelize';
import foundationalDataModel from '../models/foundationalDataModel';
import { sequelize } from '../plugins/sequelize';

export const createFoundationalDataTypes = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const foundationalDataPayload = request.body as Omit<foundationalData, '_id'>;
        const foundationalData: any = await foundationalDataTypes.create(foundationalDataPayload);
        reply.status(201).send({
            status_code: 201,
            data: {
                id: foundationalData?.id,
                name: foundationalData?.name,
            },
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error while creating foundation datatype', error, trace_id: generateCustomUUID() });
    }
};

export const updateFoundationalDataTypes = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const foundationalData = request.body as foundationalData;
    try {
        const data = await foundationalDataTypes.findByPk(id);
        if (data) {
            await data.update(foundationalData);
            reply.status(201).send({
                status_code: 201,
                foundational_datatype_id: id,
                trace_id: generateCustomUUID(),
                message: 'Foundational data type updated successfully.',
            });
        } else {
            reply.status(200).send({ message: 'Foundational Datatypes not found' });
        }
    } catch (error) {
        reply.status(500).send({ message: 'Error updating foundational data', error, trace_id: generateCustomUUID() });
    }
}

export const deleteFoundationalDataTypes = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const { id } = request.params as { id: string };
        const data = await foundationalDataTypes.findOne({
            where: { id },
        });

        if (!data) {
            return reply.status(200).send({ message: 'Foundational Datatypes not found' });
        }

        await data.update({ is_enabled: false, is_deleted: true });
        reply.status(204).send({
            status_code: 204,
            foundational_datatype_id: id,
            trace_id: generateCustomUUID(),
            message: 'Foundational data type Deleted Successfully'
        });
    } catch (error) {
        reply.status(500).send({ message: 'Error deleting foundational data', error, trace_id: generateCustomUUID() });
    }
}

export async function getFoundationalDataTypeById(request: FastifyRequest, reply: FastifyReply) {
    const { id, program_id } = request.params as { id: string, program_id: string };
    try {
        const foundationalDataType = await foundationalDataTypes.findOne({
            where: {
                id,
                program_id,
                is_deleted: false,
            },
            attributes: ['id', 'name', 'description', 'is_enabled', 'created_on', 'program_id', 'configuration']
        });

        if (foundationalDataType) {
            const foundationalDataCount = await foundationalDataModel.count({
                where: {
                    foundational_data_type_id: id
                }
            });

            const foundationalDataTypeResponse = {
                ...foundationalDataType.dataValues,
                foundational_data_count: foundationalDataCount
            };

            reply.status(200).send({
                status_code: 200,
                foundational_data: foundationalDataTypeResponse,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: 'Foundational datatype not found',
                foundational_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Internal Server Error' });
    }
}

export async function getAllFoundationalDataTypes(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['name', 'is_enabled'];
    const responseFields = ['id', 'program_id', 'name', 'is_enabled', 'modified_on', 'description', 'configuration'];
    const { program_id } = request.params as { program_id: string };
    try {
        const foundationalData: any = await ReturnData(request, reply, foundationalDataTypes, searchFields, responseFields, program_id);
        if (!foundationalData || !foundationalData.items || foundationalData.items.length === 0) {
            reply.status(200).send({ message: 'No foundational data found' });
            return;
        }

        const foundationalDataTypeIds = foundationalData.items.map((item: { dataValues: { id: any; }; }) => item.dataValues.id);
        const foundationalDataCounts = await foundationalDataModel.findAll({
            where: {
                foundational_data_type_id: {
                    [Op.in]: foundationalDataTypeIds
                }
            },
            attributes: ['foundational_data_type_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['foundational_data_type_id']
        });

        const foundationalDataCountMap = new Map<string, number>();
        foundationalDataCounts.forEach((item: any) => {
            foundationalDataCountMap.set(item.foundational_data_type_id, item.dataValues.count);
        });

        const populatedFoundationalData = foundationalData.items.map((item: { dataValues: { id: any; }; }) => ({
            ...item.dataValues,
            foundational_data_count: foundationalDataCountMap.get(item.dataValues.id) || 0
        }));

        reply.send({ total_records: foundationalData.total_records, foundationalData: populatedFoundationalData });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Internal server error', error });
    }
}

export async function ReturnData(
    request: FastifyRequest,
    reply: FastifyReply,
    model: any,
    searchFields: string[],
    responseFields: string[],
    program_id?: string
) {
    const query = request.query as Record<string, string>;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const sortField = query.sortField || "created_on";
    const sortDirection = query.sortDirection || "DESC";

    const validSortFields = [...searchFields, "created_on"];
    const validDirections: ("ASC" | "DESC")[] = ["ASC", "DESC"];

    const finalSortField = validSortFields.includes(sortField) ? sortField : "created_on";
    const finalSortDirection = validDirections.includes(sortDirection as "ASC" | "DESC") ? sortDirection : "DESC";

    try {
        let searchConditions: any = {};

        if (program_id) {
            searchConditions['program_id'] = program_id;
        }

        searchFields.forEach(field => {
            if (query[field]) {
                if (field === 'is_enabled') {
                    searchConditions[field] = query[field] === 'true' ? 1 : 0;
                } else {
                    searchConditions[field] = {
                        [Op.like]: `%${query[field].trim()}%`
                    };
                }
            }
        });

        let attributes: string[] | undefined = responseFields;
        if (query.info_level == "detail") {
            attributes = undefined;
        }

        const totalRecords = await model.count({
            where: { ...searchConditions, is_deleted: false },
        });

        const results = await model.findAll({
            where: { ...searchConditions, is_deleted: false },
            limit: limit,
            offset: offset,
            attributes: attributes,
            order: [[finalSortField, finalSortDirection]],
        });

        return {
            total_records: totalRecords,
            items: results
        };

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: 'Internal Server Error' });
    }
}
