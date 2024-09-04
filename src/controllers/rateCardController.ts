import { FastifyRequest, FastifyReply } from 'fastify';
import { rateCardModel } from '../models/rateCardModel';
import { RateCardInterface } from '../interfaces/rateCardInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import Currencies from '../models/currenciesModel';

export async function getAllRateCard(
    request: FastifyRequest<{ Params: RateCardInterface, Querystring: RateCardInterface }>,
    reply: FastifyReply
) {
    try {
        const params = request.params as RateCardInterface;
        const query = request.query as RateCardInterface | any;

        const page = parseInt(query.page ?? '1');
        const limit = parseInt(query.limit ?? '10');
        const offset = (page - 1) * limit;
        query.page && delete query.page;
        query.limit && delete query.limit;
        if (query.is_enabled) {
            query.is_enabled == 'false' ? query.is_enabled = false : query.is_enabled = true;
        }

        const { rows: rateCard, count } = await rateCardModel.findAndCountAll({
            where: { ...query, is_deleted: false, program_id: params.program_id },
            attributes: {
                exclude: ["is_deleted", "program_id","currency_id"],
            },
            include: [
                {
                    model: Currencies,
                    as: 'currency',
                    attributes: ['id', 'name'],
                },
            ],
            limit: limit,
            offset: offset,
        });
        if (rateCard.length === 0) {
            return reply.status(200).send({ message: "Rate Card Not Found", rateCard: [] });
        }
        reply.status(200).send({
            status_code: 200,
            items_per_page: limit,
            total_records: count,
            rate_card: rateCard,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error', error: error
        });
    }
}


export async function saveRateCard(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const rate_card = request.body as RateCardInterface;

        const item = await rateCardModel.create({ ...rate_card });
        reply.status(201).send({
            status_code: 201,
            rate_card: item?.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while creating',
            error
        });
    }
}


export const getRateCardById = async (request: FastifyRequest<{ Params: { id: string; program_id: string } }>, reply: FastifyReply) => {
    const { id, program_id } = request.params as { id: string, program_id: string };

    if (!program_id) {
        reply.status(400).send({
            status_code: 400,
            message: 'Program Id is Required',
            trace_id: generateCustomUUID(),
        });
        return;
    }

    try {
        const rateCardData = await rateCardModel.findOne({
            where: { id, program_id },
            attributes: {
                exclude: ["is_deleted", "program_id"],
            },
        });

        if (rateCardData) {
            reply.status(200).send({
                status_code: 200,
                rate_card: rateCardData,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'Rate Card Not Found',
                trace_id: generateCustomUUID(),
                rate_card: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: 'Internal Server Error',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
};

export const updateRateCardById = async (
    request: FastifyRequest<{ Params: { id: string; program_id: string }; Body: RateCardInterface }>,
    reply: FastifyReply
) => {
    const { id, program_id } = request.params;
    const updates = request.body;

    if (!program_id) {
        reply.status(400).send({
            status_code: 400,
            message: 'Program Id is Required',
            trace_id: generateCustomUUID(),
        });
        return;
    }

    try {
        const [updatedCount] = await rateCardModel.update(updates, {
            where: { id, program_id },
        });

        if (updatedCount > 0) {
            reply.status(201).send({
                status_code: 200,
                message: 'Rate Card Updated Successfully',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'Rate Card Not Found',
                trace_id: generateCustomUUID(),
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: 'Internal Server Error: Failed to update Rate Card',
            trace_id: generateCustomUUID(),
        });
    }
};

export async function deleteRateCardById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id } = request.params;
        const rateCard = await rateCardModel.findByPk(id);
        if (rateCard) {
            await rateCard.update({
                is_enabled: false,
                is_deleted: true,
            })
            reply.status(200).send({
                status_code: 200,
                message: 'Rate Card Deleted Successfully',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'Rate Card Not Found',
                trace_id: generateCustomUUID(),
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: 'Internal Server Error: Failed to delete Rate Card',
            trace_id: generateCustomUUID(),
            error: error as Error,
        });
    }
}