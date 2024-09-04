import { FastifyRequest, FastifyReply } from "fastify";
import CostcomponentModel from "../models/costcomponentModel";
import { costcomponentData, } from "../interfaces/costcomponentInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import { Op } from "sequelize";

export async function createCostcomponent(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    try {
        const costcomponent = request.body as costcomponentData;

        const item: any = await CostcomponentModel.create({ ...costcomponent });
        reply.status(201).send({
            statusCode: 201,
            cost_component_id: item?.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function getCostcomponent(
    request: FastifyRequest<{ Params: costcomponentData, Querystring: costcomponentData }>,
    reply: FastifyReply
) {
    try {
        const params = request.params as costcomponentData;
        const query = request.query as costcomponentData | any;

        const page = parseInt(query.page ?? "1");
        const limit = parseInt(query.limit ?? "10");
        const offset = (page - 1) * limit;
        query.page && delete query.page;
        query.limit && delete query.limit;

        const searchConditions: any = {};
        if (query.name) {
            searchConditions.name = { [Op.like]: `%${query.name}%` };
        }
        if (query.is_enabled) {
            query.is_enabled == "false" ? query.is_enabled = false : query.is_enabled = true;
        }
        if (query.code) {
            searchConditions.code = { [Op.like]: `%${query.code}%` };
        }
        const { rows: costcomponent, count } = await CostcomponentModel.findAndCountAll({
            where: { ...query, ...searchConditions, program_id: params.program_id },
            attributes: { exclude: ["ref_id", "program_id"] },
            limit: limit,
            order: [["created_on", "DESC"]],
            offset: offset,
        });
        if (costcomponent.length === 0) {
            return reply.status(200).send({
                message: "Costcomponent not found",
                cost_component: []
            });
        }
        reply.status(200).send({
            statusCode: 200,
            items_per_page: limit,
            total_records: count,
            cost_component: costcomponent,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            statusCode: 500,
            message: "Internal Server error",
            error: error,
            trace_id: generateCustomUUID(),
        });
    }
}


export async function getCostcomponentById(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const item = await CostcomponentModel.findOne({
            where: { id, program_id },
            attributes: { exclude: ["ref_id", "program_id"] },
        });
        if (item) {
            reply.status(201).send({
                statusCode: 201,
                cost_component: item,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Costcomponent not found",
                cost_component: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function updateCostcomponent(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const costcomponent = request.body as costcomponentData;
        const [numRowsUpdated] = await CostcomponentModel.update(
            { ...costcomponent, modified_on: Date.now() },
            { where: { id } }
        );

        if (numRowsUpdated > 0) {
            reply.status(201).send({
                statusCode: 201,
                message: "Cost component updated successfully",
                cost_component_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Costcomponent not found",
                cost_component: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function deleteCostcomponent(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const [numRowsDeleted] = await CostcomponentModel.update({

            is_enabled: true,
        },
            { where: { id, program_id } }
        );

        if (numRowsDeleted > 0) {
            reply.status(204).send({
                statusCode: 204,
                cost_component_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Costcomponent not found",
                cost_component: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}
