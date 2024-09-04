import { FastifyRequest, FastifyReply } from "fastify";
import vendorDocumentroupModel from "../models/vendordocumentgroupModel";
import { VendorDocumentGroup } from "../interfaces/vendordocumentgroupInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import { Op } from "sequelize";

export async function createVendordocumentsgroup(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const vendorDocumentsGroup = request.body as VendorDocumentGroup;

        const item = await vendorDocumentroupModel.create({ ...vendorDocumentsGroup });
        reply.status(201).send({
            status_code: 201,
            vendor_documents_group_id: item.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function getVendorDocumentsGroupByIdAndDoc(
    request: FastifyRequest<{ Params: { id: string; program_id: string; required_documents?: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id, required_documents } = request.params;

        const query: any = {
            where: {
                id,
                program_id,
                is_deleted: false
            },
            attributes: { exclude: ["ref_id", "entity_ref", "code", "program_id", "created_on"] }
        };

        if (required_documents) {
            query.where.required_documents = required_documents;
        }
        const vendorDocumentsGroup = await vendorDocumentroupModel.findOne(query);

        if (vendorDocumentsGroup) {
            reply.status(200).send({
                status_code: 200,
                vendorDocumentsGroup,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: "Vendor documents group not found" });
        }
    } catch (error) {
        reply.status(500).send({
            message: "An error occurred while fetching vendor documents group.",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function getVendordocumentsgroup(
    request: FastifyRequest<{ Params: VendorDocumentGroup; Querystring: VendorDocumentGroup }>,
    reply: FastifyReply
) {
    try {
        const params = request.params as VendorDocumentGroup;
        const query = request.query as VendorDocumentGroup | any;

        const page = parseInt(query.page ?? "1");
        const limit = parseInt(query.limit ?? "10");
        const offset = (page - 1) * limit;
        query.page && delete query.page;
        query.limit && delete query.limit;
        query.is_enabled = true;

        const searchConditions: any = {};
        if (query.name) {
            searchConditions.name = { [Op.like]: `%${query.name}%` };
        }
        if (query.entity_ref) {
            searchConditions.entity_ref = { [Op.like]: `%${query.entity_ref}%` };
        }

        const count = await vendorDocumentroupModel.count({
            where: {
                ...query,
                program_id: params.program_id,
                ...searchConditions,
                is_deleted: false,
            },
        });

        const vendorDocumentsGroup = await vendorDocumentroupModel.findAll({
            where: {
                ...query,
                program_id: params.program_id,
                ...searchConditions,
                is_deleted: false,
            },
            attributes: { exclude: ["ref_id", "program_id", "modified_by", "created_by"] },
            limit: limit,
            order: [["created_on", "DESC"]],
            offset: offset,
        });

        if (vendorDocumentsGroup.length === 0) {
            return reply.status(200).send({ message: "Vendor documents group not found", vendorDocumentsGroup: [] });
        }

        const vendorDocumentsGroupWithCount = vendorDocumentsGroup.map(group => {
            return {
                ...group.toJSON(),
                total_documents: group.required_documents.length,
            };
        });

        reply.status(200).send({
            status_code: 200,
            items_per_page: limit,
            total_records: count,
            vendorDocumentsGroup: vendorDocumentsGroupWithCount,
            trace_id: generateCustomUUID(),
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            status_code: 500,
            message: "Internal Server error",
            error: error,
            trace_id: generateCustomUUID(),
        });
    }
}
export async function getVendordocumentsgroupId(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const vendorDocumentsGroup = await vendorDocumentroupModel.findOne({
            where: { id, program_id },
            attributes: { exclude: ["ref_id", "entity_ref", "code", "program_id", "created_on"] },
        });

        if (vendorDocumentsGroup) {
            const response = {
                ...vendorDocumentsGroup.toJSON(),
                total_documents: vendorDocumentsGroup.required_documents.length,
            };
            reply.status(200).send({
                status_code: 200,
                vendorDocumentsGroup: response,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Vendor documents group not found",
                vendor_documents_group: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function updateVendordocumentsgroup(
    request: FastifyRequest<{ Params: { id: string, program_id: string }; }>,
    reply: FastifyReply
) {
    const { id, program_id } = request.params;
    const vendorDocumentsGroupData = request.body as VendorDocumentGroup;

    try {
        const [updatedCount] = await vendorDocumentroupModel.update(vendorDocumentsGroupData, {
            where: {
                id: id,
                program_id: program_id,
                is_deleted: false,
            },
        });

        if (updatedCount > 0) {
            reply.status(201).send({
                status_code: 201,
                vendor_documents_group_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Vendor documents group not found",
                vendor_documents_group: [],
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export async function deleteVendordocumentsgroup(
    request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
    reply: FastifyReply
) {
    try {
        const { id, program_id } = request.params;
        const [numRowsDeleted] = await vendorDocumentroupModel.update({
            is_enabled: false,
            modified_on: Date.now(),
            is_deleted: true
        },
            { where: { id, program_id } }
        );

        if (numRowsDeleted > 0) {
            reply.status(204).send({
                status_code: 204,
                vendor_documents_group_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "Vendor documents group not found",
                vendor_documents_group: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}
