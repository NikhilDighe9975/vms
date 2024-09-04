
import { FastifyRequest, FastifyReply } from 'fastify';
import venderGroup from '../models/vendorGroupModel';
import { vendorGroupInterface } from '../interfaces/vendorGroupInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import { Op } from 'sequelize';
import { baseSearch } from '../utility/baseService';
import { programVendor } from '../models/programVendorModel';

export const createVendorGroup = async (
    request: FastifyRequest<{ Params: { program_id: string } }>,
    reply: FastifyReply
) => {
    const program_id = request.params.program_id;
    const vendorGroup = request.body as vendorGroupInterface;

    if (!vendorGroup.vendor_group_name) {
        return reply.status(400).send({
            status_code: 400,
            message: 'vendor_group_name is required.',
            trace_id: generateCustomUUID(),
        });
    }

    try {
        const createdVendorGroup = await venderGroup.create({
            ...vendorGroup,
            program_id
        });

        reply.status(201).send({
            status_code: 201,
            trace_id: generateCustomUUID(),
            message: 'Vendor Group Created Successfully.',
            vendor_group_id: createdVendorGroup.id,
        });
    } catch (error) {
        console.error('Error creating vendor group:', error);
        reply.status(500).send({
            status_code: 500,
            message: 'An error occurred while creating Vendor Group.',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
};


export async function getVendorGroups(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ['vendor_group_name', 'description', 'status', 'program_id'];
    const responseFields = ['id', 'vendor_group_name', 'status', 'description', 'modified_on'];
    return baseSearch(request, reply, venderGroup, searchFields, responseFields);
}


export async function getVendorGroupById(
    request: FastifyRequest<{ Params: { id: string; program_id: string } }>,
    reply: FastifyReply
) {
    const { id, program_id } = request.params;

    try {
        const vendorGroup = await venderGroup.findOne({
            where: { id, program_id },
            include: [
                {
                    model: programVendor,
                    as: 'program_vendor',
                    attributes: ['id', 'vendor_name'],
                },
            ],
        });

        if (!vendorGroup) {
            return reply.status(200).send({
                status_code: 200,
                message: 'Vendor Group not found.',
                trace_id: generateCustomUUID(),
            });
        }
        const vendorIds = vendorGroup.vendors || [];
        const detailedVendors = await programVendor.findAll({
            where: { id: vendorIds },
            attributes: ['id', 'vendor_name'],  
        });

        return reply.status(200).send({
            status_code: 200,
            vendor_group: {
                ...vendorGroup.toJSON(),
                vendors: detailedVendors.map(vendor => vendor.toJSON()), 
            },
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        console.error('Server error:', error);
        return reply.status(500).send({
            status_code: 500,
            trace_id: generateCustomUUID(),
            message: 'Internal Server Error',
            error: (error as Error).message,
        });
    }
}



export async function updateVendorGroup(request: FastifyRequest, reply: FastifyReply) {
    const { id, program_id } = request.params as { id: string; program_id: string };
    const data: Partial<vendorGroupInterface> = request.body as Partial<vendorGroupInterface>;

    try {
        const vendorGroup = await venderGroup.findOne({
            where: { id, program_id }
        });

        if (vendorGroup) {
            await vendorGroup.update(data);
            return reply.status(200).send({
                status_code: 200,
                message: 'Vendor Group updated successfully.',
                trace_id: generateCustomUUID()
            });
        } else {
            return reply.status(200).send({
                status_code: 200,
                message: 'Vendor Group not found.',
                trace_id: generateCustomUUID(),
                vendor_group: []
            });
        }
    } catch (error) {
        console.error(error);
        return reply.status(500).send({
            status_code: 500,
            message: 'Internal Server Error',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}

export const deleteVendorGroup = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id, program_id } = request.params as { id: string; program_id: string };

    try {
        const vendorGroup = await venderGroup.findOne({ where: { id, program_id } });

        if (vendorGroup) {
            vendorGroup.is_deleted = true;
            await vendorGroup.save();
            return reply.status(200).send({
                status_code: 200,
                message: 'Vendor Group deleted successfully.',
                trace_id: generateCustomUUID()
            });
        } else {
            return reply.status(200).send({
                status_code: 200,
                message: 'Vendor Group not found.',
                trace_id: generateCustomUUID(),
                vendor_group: []
            });
        }
    } catch (error) {
        console.error(error);
        return reply.status(500).send({
            status_code: 500,
            message: 'Internal Server Error',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
}








