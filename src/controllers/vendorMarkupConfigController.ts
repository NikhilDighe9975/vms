import { FastifyRequest, FastifyReply } from 'fastify';
import vendorMarkupConfig from '../models/vendorMarkupConfigModel';
import vendorMarkupConfigInterface from '../interfaces/vendorMarkupConfigInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import { baseSearch } from '../utility/baseService';

export async function getAllVendorMarkupConfig(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['tenant_id', 'is_enabled', 'rate_nodel', 'sourced_markup', 'program_id'];
    const responseFields = ['id', 'tenant_id', 'program_id', 'is_enabled', 'rate_nodel', 'sliding_scale', 'hierarchy', 'sourced_markup', 'payrolled_markup'];
    return baseSearch(request, reply, vendorMarkupConfig, searchFields, responseFields)
}

export async function getVendorMarkupConfigById(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const item = await vendorMarkupConfig.findOne({
            where: {
                id,
                program_id,
                is_deleted: false,
            },
        });
        if (item) {
            reply.status(200).send({
                status_code: 200,
                trace_id: generateCustomUUID(),
                vendor_markup_config: item
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                trace_id: generateCustomUUID(),
                vendor_markup_config: [],
                message: 'vendorMarkupConfig not found.',
            });
        }
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            trace_id: generateCustomUUID(),
            message: "Internal Server Error",
            error
        });
    }
}

export async function createVendorMarkupConfig(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const { program_id } = request.params as { program_id: string };
        const vendor = request.body as vendorMarkupConfigInterface;

        if (!program_id) {
            return reply.status(400).send({
                status_code: 400,
                trace_id: generateCustomUUID(),
                message: 'Program id is required.',
            });
        }
        const vendorData = await vendorMarkupConfig.create({ ...vendor, program_id });
        reply.status(201).send({
            status_code: 201,
            trace_id: generateCustomUUID(),
            message: 'vendorMarkupConfig created successfully.',
            vendor: vendorData
        });
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            trace_id: generateCustomUUID(),
            message: "Internal Server Error",
            error
        });
    }
}

export async function updateVendorMarkupConfig(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const data = request.body as vendorMarkupConfigInterface;

        const vendorData = await vendorMarkupConfig.findOne({
            where: { id, program_id, is_deleted: false },
        });

        if (!vendorData) {
            return reply.status(200).send({
                trace_id: generateCustomUUID(),
                message: 'vendorMarkupConfig data not found.',
                vendor_markup_config: [],
            });
        }
        await vendorData.update(data);
        reply.status(201).send({
            status_code: 201,
            message: 'vendorMarkupConfig updated successfully.',
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            message: 'Internal Server Error',
            trace_id: generateCustomUUID(),
        });
    }
}

export async function deleteVendorMarkupConfig(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
        const { id, program_id } = request.params as { id: string, program_id: string };
        const vendorData = await vendorMarkupConfig.findOne({
            where: { id, program_id, is_deleted: false },
        });
        if (!vendorData) {
            return reply.status(200).send({ message: 'vendorMarkupConfig data not found.', vendor_markup_config: [] });
        }
        await vendorData.update({ is_enabled: false, is_deleted: true });
        reply.status(204).send({
            status_code: 204,
            trace_id: generateCustomUUID(),
            message: 'vendorMarkupConfig Deleted Successfully.'
        });
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            trace_id: generateCustomUUID(),
            message: "Internal Server Error",
            error
        });
    }
}
