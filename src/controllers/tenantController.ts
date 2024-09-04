import { FastifyRequest, FastifyReply } from "fastify";
import Tenant from "../models/tenantModel";
import { Programs } from "../models/programsModel"
import { TenantData } from "../interfaces/tenantInterface";
import { Op, Sequelize } from "sequelize";
import { baseSearch, advanceSearch } from "../utility/baseService";
import generateCustomUUID from "../utility/genrateTraceId"

export async function getTenants(request: FastifyRequest<{ Querystring: TenantData }>, reply: FastifyReply) {
    const { name, type, created_on, ...query } = request.query as TenantData;
    try {
        const tenants = await Tenant.findAll({
            where: {
                is_deleted: false,
            },
            attributes: ["id", "name", "contacts", "created_on", "is_enabled"],
            order: [["created_on", "DESC"]],
        });
        if (tenants.length === 0) {
            return reply.status(200).send({ message: "Tenants not found", tenants: [] });
        }

        reply.status(200).send({
            status_code: 200,
            items_per_page: tenants.length,
            total_records: tenants.length,
            trace_id: generateCustomUUID(),
            tenant_data: tenants,
        });
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function getTenantById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {

        const tenant = await Tenant.findOne({
            where: {
                id,
                is_deleted: false,
            }
        });

        if (tenant) {
            const programCount = await Programs.count({
                where: {
                    [Op.or]: [
                        { msp_id: id },
                        { client_id: id }
                    ]
                }
            });
            const tenantData = tenant.toJSON();
            tenantData.program_count = programCount;
            reply.status(200).send({
                status_code: 200,
                tenant_data: tenantData,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: "Tenant not found", tenant: [] });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function createTenant(data: Omit<TenantData, "_id">, reply: FastifyReply) {
    try {
        const existingTenant = await Tenant.findOne({
            where: { name: data.name }
        });

        if (existingTenant) {
            return reply.status(400).send({
                status_code: 400,
                message: 'A tenant with the same name already exists',
                trace_id: generateCustomUUID(),
            });
        }

        const processedData = {
            ...data,
            type: data.type?.toLowerCase(),
        };
        const newItem: any = await Tenant.create(processedData);
        reply.status(201).send({
            status_code: 201,
            data: newItem?.id,
            trace_id: generateCustomUUID(),
        });
    } catch (error: any) {
        if (error.name === "SequelizeUniqueConstraintError") {
            const field = error.errors[0].path;
            return reply.status(400).send({ error: `${field} already in use!` });
        }
        console.error(error);
        return reply.status(500).send({ message: "Failed To Create Tenant", error });
    }
}

export async function updateTenant(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const TenantData = request.body as TenantData;
    try {
        const tenant: Tenant | null = await Tenant.findByPk(id);
        if (tenant) {
            await tenant.update(TenantData);
            reply.status(200).send({
                status_code: 200,
                tenant_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: "Tenant not found",tenants:[] });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function deleteTenant(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
        const tenant = await Tenant.findByPk(id);
        if (tenant) {
            await tenant.destroy();
            reply.status(200).send({
                status_code: 200,
                tenant_id: id,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({ message: "Tenant not found",tenants:[] });
        }
    } catch (error) {
        console.error(error);
        reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function searchTenantsWithProgramCount(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ["id", "name", "contacts", "created_on", "is_enabled", "type"];
    const responseFields = ["id", "name", "contacts", "created_on", "is_enabled", "type"];

    try {
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

        let attributes: any[] | undefined = responseFields.map(field => [field, field]);
        if (query.info_level === "detail") {
            attributes = undefined;
        } else {
            attributes.push([
                Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM programs AS p
                    WHERE p.msp_id = Tenant.id OR p.client_id = Tenant.id
                )`),
                "program_count"
            ]);
        }

        const { rows: results, count } = await Tenant.findAndCountAll({
            where: { ...searchConditions, is_deleted: false },
            limit: limit,
            offset: offset,
            attributes: attributes,
            order: [[finalSortField, finalSortDirection]],
        });

        return reply.status(200).send({
            status_code: 200,
            total_records: count,
            tenants: results
        });
    } catch (error) {
        return reply.status(500).send({ message: "Internal Server Error" });
    }
}

export async function advancedSearchTenants(request: FastifyRequest, reply: FastifyReply) {
    const searchFields = ["name", "is_enabled", "modified_on", "display_name"];
    const responseFields = ["id", "name", "type", "is_enabled"];
    return advanceSearch(request, reply, Tenant, searchFields, responseFields);
}

export async function getPasswordPolicy(request: FastifyRequest<{ Params: { client_id: string } }>, reply: FastifyReply) {
    try {
        const { client_id } = request.params;
        const tenant: Tenant | null = await Tenant.findOne({
            where: { id: client_id },
            attributes: ['password_policy'],
        });
        if (tenant) {
            reply.status(200).send({
                status_code: 200,
                password_policy: tenant.password_policy,
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'password_policy not found.',
                password_policy: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching password_policy.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

