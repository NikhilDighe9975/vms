import { FastifyRequest, FastifyReply } from 'fastify';
import ReasoncodeModel from '../models/reasoncodeModel';
import { ReasonCode, ReasonCodeResponse } from '../interfaces/reasoncodeInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import { baseSearch } from '../utility/baseService';
import SupportingTextEvent from '../models/eventModel';
import { Module } from '../models/moduleModel';
import { Op } from 'sequelize';

export async function createReasoncode(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const reasoncode = request.body as ReasonCodeResponse;

        const item = await ReasoncodeModel.create({ ...reasoncode });
        reply.status(201).send({
            status_code: 201,
            reason_code_id: item.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while creating',
            error
        });
    }
}

export async function getReasoncode(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { program_id } = request.params as { program_id: string };

        const reasoncodes = await ReasoncodeModel.findAll({
            where: {
                program_id,
                is_deleted: false,
            },
            attributes: {
                exclude: ['ref_id', 'modified_by', 'created_by', 'event_id', 'module_id', 'created_on', 'is_deleted', 'reason_code_limit']
            },
            include: [
                {
                    model: SupportingTextEvent,
                    as: 'supporting_text_event',  // Use the correct alias
                    attributes: ['id', 'name'],
                    where: { is_enabled: true },
                    required: false,
                },
                {
                    model: Module,
                    as: 'module',
                    attributes: ['id', 'name'],
                    where: { is_enabled: true },
                    required: false,
                },
            ],
            order: [['created_on', 'DESC']],
        });
        const reasoncodesWithDetails = reasoncodes.map((reasoncode: any) => {
            const { reason, supporting_text_event, module, ...reasoncodeWithoutReason } = reasoncode.toJSON();  // Exclude 'reason' from the response
            return {
                ...reasoncodeWithoutReason,
                reasons_count: reason ? reason.length : 0,
                module_name: module?.name || 'Unknown Module',
                module_id: module?.id || 'Unknown id',
                event_name: supporting_text_event?.name || 'Unknown Event',
                event_id: supporting_text_event?.id || 'Unknown id',

            };
        });

        if (!reasoncodesWithDetails || reasoncodesWithDetails.length === 0) {
            return reply.status(200).send({ message: "Reasoncode not found", reasoncodes: [] });
        }

        reply.status(200).send({
            status_code: 200,
            reasoncodes: reasoncodesWithDetails,
            trace_id: generateCustomUUID(),  // Assuming you have this function defined somewhere
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            status_code: 500,
            message: 'Internal Server error',
            error: error,
        });
    }
}

export async function getReasoncodeId(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const reason_code = await ReasoncodeModel.findOne({
            where: { id, program_id },
            attributes: { exclude: ['ref_id', 'entity_ref', 'code', 'program_id', 'event_id', 'module_id', 'is_deleted', 'created_on', 'reasons_count', 'created_by', 'modified_by', 'reason_code_limit', 'modified_on'] },
            include: [
                {
                    model: SupportingTextEvent,
                    as: 'supporting_text_event',
                    attributes: ['id', 'name'],
                    where: { is_enabled: true },
                },
                {
                    model: Module,
                    as: 'module',
                    attributes: ['id', 'name'],
                    where: { is_enabled: true },
                },
            ],
        });

        if (reason_code) {
            const reasoncode = reason_code.toJSON();  // Convert to plain object
            // Destructure and remove `module` from the response
            const { reason, supporting_text_event, module, ...reasoncodeWithoutExtras } = reasoncode;
            const reasoncodeWithDetails = {
                ...reasoncodeWithoutExtras,
                module_name: module?.name || 'Unknown Module',
                module_id: module?.id || 'Unknown id',
                event_name: supporting_text_event?.name || 'Unknown Event',
                event_id: supporting_text_event?.id || 'Unknown id',
                reason,
            };

            reply.status(200).send({
                status_code: 200,
                reason_code: reasoncodeWithDetails,
                trace_id: generateCustomUUID(),  // Assuming you have this function defined somewhere
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                reason_code: [],  // Return empty array
                trace_id: generateCustomUUID(),  // Assuming you have this function defined somewhere
            });
        }
    } catch (error) {
        reply.status(500).send({ message: 'An error occurred while fetching', error });
    }
}

export async function updateReasoncode(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const reasonCodeData = request.body as ReasonCode;
    try {
        const reasonCode: ReasoncodeModel | null = await ReasoncodeModel.findByPk(id);
        if (reasonCode) {
            if (
                reasonCodeData.program_id && reasonCodeData.program_id !== reasonCode.program_id ||
                reasonCodeData.module_id && reasonCodeData.module_id !== reasonCode.module_id ||
                reasonCodeData.event_id && reasonCodeData.event_id !== reasonCode.event_id
            ) {
                return reply.status(400).send({
                    status_code: 400,
                    message: 'program_id, module_id, and event_id fields cannot be modified',
                });
            }
            await reasonCode.update(reasonCodeData);
            reply.status(200).send({
                status_code: 200,
                reason_code: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: 'Custom Field not found' });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: 'Internal Server Error' });
    }
}

export async function deleteReasoncode(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const [numRowsDeleted] = await ReasoncodeModel.update({
            is_enabled: false,
            modified_on: Date.now(),
        },
            { where: { id, program_id } }
        );

        if (numRowsDeleted > 0) {
            reply.status(200).send({
                status_code: 200,
                reason_code_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: 'Reasoncode not found' });
        }
    } catch (error) {
        reply.status(500).send({ message: 'An error occurred while deleting', error });
    }
}
