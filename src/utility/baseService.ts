import { Op } from "sequelize";
import { FastifyRequest, FastifyReply } from "fastify";
import generateCustomUUID from "../utility/genrateTraceId"

export async function baseSearch(
    request: FastifyRequest,
    reply: FastifyReply,
    model: any,
    searchFields: string[],
    responseFields: string[]
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

        searchFields.forEach(field => {
            if (query[field]) {
                if (field === "is_enabled") {
                    searchConditions[field] = query[field] === "true" ? 1 : 0;
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

        const { rows: results, count } = await model.findAndCountAll({
            where: { ...searchConditions, is_deleted: false },
            limit: limit,
            offset: offset,
            attributes: attributes,
            order: [[finalSortField, finalSortDirection]],
        });

        return reply.status(200).send({
            status_code: 200,
            total_records: count,
            items: results
        });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function advanceSearch(
    request: FastifyRequest,
    reply: FastifyReply,
    model: any,
    searchFields: string[],
    responseFields: string[]
) {
    const body = request.body as Record<string, any>;

    try {
        const whereCondition: { [key: string]: any } = {};
        searchFields.forEach(field => {
            if (body.hasOwnProperty(field)) {
                if (Array.isArray(body[field])) {
                    if (body[field].length === 2) {
                        whereCondition[field] = {
                            [Op.between]: [new Date(body[field][0]), new Date(body[field][1])]
                        };
                    }
                } else if (typeof body[field] === "string" && field !== "is_enabled") {
                    whereCondition[field] = { [Op.like]: `%${body[field].trim()}%` };
                } else if (field === "is_enabled") {
                    whereCondition[field] = body[field] === "true" ? 1 : 0;
                } else {
                    whereCondition[field] = body[field];
                }
            }
        });

        const results = await model.findAll({
            where: whereCondition,
            attributes: responseFields
        });

        if (results.length > 0) {
            return reply.status(200).send({
                status_code: 200,
                data: results,
                trace_id: generateCustomUUID(),
            });
        } else {
            return reply.status(200).send({ message: "No records found" });
        }

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Internal Server Error" });
    }
}