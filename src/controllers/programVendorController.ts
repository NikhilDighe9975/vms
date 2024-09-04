import { programVendor } from "../models/programVendorModel";
import { FastifyRequest, FastifyReply } from "fastify";
import { baseSearch } from "../utility/baseService";
import generateCustomUUID from "../utility/genrateTraceId";
import { programVendorInterface } from "../interfaces/programVendorInterface";
import vendorWorkLocationMapping from "../models/vendorWorkLocationMappingModel";
import VendorHierarchyMapping from "../models/vendorHieararchyMappingModel";
import vendorLabourCategoriesModel from "../models/vendorLabourCategoriesModel";
import { Op } from "sequelize";

export async function getProgramVendors(
    request: FastifyRequest<{ Params: { program_id: string }, Querystring: { vendor_name?: string, is_enabled?: boolean, status?: string, modified_on?: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id } = request.params;
        const { vendor_name, is_enabled, status, modified_on } = request.query;

        const filters: any = { program_id };

        if (vendor_name) {
            filters.vendor_name = { [Op.like]: `%${vendor_name}%` };
        }

        if (is_enabled !== undefined) {
            filters.is_enabled = is_enabled;
        }

        if (status) {
            filters.status = status;
        }

        if (modified_on) {
            filters.modified_on = modified_on;
        }

        const program_vendors = await programVendor.findAll({
            where: filters,
            attributes: ['id', 'program_id', 'vendor_name', 'is_enabled', 'modified_on', 'status']
        });

        if (program_vendors.length > 0) {
            reply.status(200).send({
                status_code: 200,
                message: 'ProgramVendors fetched successfully.',
                trace_id: generateCustomUUID(),
                program_vendors
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'No ProgramVendors found.',
                program_vendors: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching ProgramVendors.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export async function getProgramVendorById(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const program_vendor = await programVendor.findOne({ where: { program_id, id } });
        if (program_vendor) {
            reply.status(200).send({
                status_code: 200,
                message: 'ProgramVendor fetch Successfully.',
                trace_id: generateCustomUUID(),
                program_vendor: program_vendor
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'ProgramVendor not found.',
                program_vendor: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching ProgramVendor.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export const saveProgramVendor = async (request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) => {
    try {
        const { hierarchies, labor_category, work_locations, ...program_vendor } = request.body as any;
        const { program_id } = request.params;

        if (!program_id) {
            return reply.status(400).send({
                status_code: 400,
                message: 'Program ID is required.',
                trace_id: generateCustomUUID(),
            });
        }

        const programVendors = await programVendor.create({
            ...program_vendor,
            program_id,
            labor_category,
            hierarchies,
            work_locations
        });

        if (!programVendors || !programVendors.id) {
            throw new Error('Failed to create program vendor');
        }

        const program_vendor_id = programVendors?.dataValues.id;
        console.log("program_vendor_id", program_vendor_id);


        if (work_locations?.length > 0) {
            for (const work_location of work_locations) {
                await vendorWorkLocationMapping.create({
                    program_id,
                    program_vendor_id: program_vendor_id,
                    work_location_name: work_location,
                    labour_category_id: labor_category
                });
            }
        }

        if (hierarchies?.length > 0) {
            for (const hierarchy of hierarchies) {
                await VendorHierarchyMapping.create({
                    program_id,
                    program_vendor_id: program_vendor_id,
                    hierarchy_id: hierarchy,
                    hierarchy_name: hierarchy
                });
            }
        }

        if (labor_category) {
            await vendorLabourCategoriesModel.create({
                program_id,
                program_vendor_id: program_vendor_id,
                labour_category_id: labor_category,
                labor_category_name: labor_category
            });
        }

        reply.status(201).send({
            status_code: 201,
            message: 'ProgramVendor saved successfully.',
            trace_id: generateCustomUUID(),
            program_vendor_id: program_vendor_id,
        });

    } catch (error) {
        console.error("Error during ProgramVendor creation:", error);
        reply.status(500).send({
            message: 'An error occurred while saving ProgramVendor.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export async function updateProgramVendor(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    const { program_id, id } = request.params;
    try {
        const [updatedCount] = await programVendor.update(request.body as programVendorInterface, { where: { program_id, id } });
        if (updatedCount > 0) {
            reply.send({
                status_code: 201,
                message: 'ProgramVendor updated successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                program_vendor: [],
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

export async function deleteProgramVendor(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const program_vendor = await programVendor.findOne({ where: { program_id, id } });
        if (program_vendor) {
            await programVendor.update({ is_deleted: true, is_enabled: false }, { where: { program_id, id } });
            reply.status(204).send({
                status_code: 204,
                message: 'ProgramVendor deleted successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                program_vendor: [],
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while deleting ProgramVendor.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}