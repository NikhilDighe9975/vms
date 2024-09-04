import { FastifyRequest, FastifyReply } from "fastify";
import UserMapping from "../models/usermappingModel";
import { UserMappingAttributes } from "../interfaces/usermappingInterface";
import User from "../models/userModel";
import generateCustomUUID from "../utility/genrateTraceId";


export const getAllUserMappings = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const userMappings = await UserMapping.findAll();
        if (userMappings.length === 0) {
            return reply.status(200).send({
                message: "User mappings not found",
                user_mapping: [],
                trace_id: generateCustomUUID(),
            });
        }
        reply.status(200).send(userMappings);
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
};


export const getUserMappingById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
        const userMapping = await UserMapping.findByPk(id);
        if (userMapping) {
            reply.status(200).send({
                status_code: 200,
                message: "Data fetched successfully",
                user_mapping: userMapping
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: "User Mapping not found",
                user_mapping: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
};

export async function createUserMappings(
    request_payload: Omit<UserMappingAttributes, "id">,
    reply: FastifyReply
) {
    try {
        const { tenant_id, user_id, role_id, program_id } = request_payload;

        const existingMapping = await UserMapping.findOne({
            where: {
                tenant_id,
                user_id,
                program_id
            }
        });

        if (existingMapping) {
            return reply.status(200).send({
                message: "A user mapping already exists for the specified tenant, user, and program."
            });
        }

        const newUserMapping = await UserMapping.create({ tenant_id, user_id, role_id, program_id });
        return reply.status(201).send({
            message: "User Mapping created successfully",
            user_mapping: newUserMapping,
            trace_id: generateCustomUUID(),
        });

    } catch (error) {
        return reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
}

export const updateUserMappingById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as Partial<UserMappingAttributes>;
    try {
        const [updatedCount] = await UserMapping.update(updates, { where: { id: id } });
        if (updatedCount > 0) {
            reply.status(201).send({
                status_code: 201,
                message: "User Mapping updated successfully",
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "User Mapping not found",
                user_mapping: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
};


export const deleteUserMappingById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
        const deletedCount = await UserMapping.destroy({ where: { id: id } });
        if (deletedCount > 0) {
            reply.status(204).send({
                status_code: 204,
                message: "User Mapping deleted successfully",
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                message: "User Mapping not found",
                user_mapping: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
};

export const getUserMappings = async (request: FastifyRequest, reply: FastifyReply) => {
    const queryParams = request.query as { [key: string]: string | boolean };

    try {
        const whereClause: any = {};

        if (queryParams.tenant_id) {
            whereClause.tenant_id = queryParams.tenant_id;
        }

        if (queryParams.user_id) {
            whereClause.user_id = queryParams.user_id;
        }

        Object.entries(queryParams).forEach(([key, value]) => {
            if (key !== "tenant_id" && key !== "user_id") {
                if (value === "true") {
                    whereClause[key] = true;
                } else if (value === "false") {
                    whereClause[key] = false;
                } else if (value) {
                    whereClause[key] = value;
                }
            }
        });

        const userMappings = await UserMapping.findAll({
            attributes: [
                "id", "tenant_id", "role_id", "user_id",
                "program_id", "is_activated", "is_deleted",
                "created_on", "modified_on", "created_by",
                "modified_by", "ref_id"
            ],
            where: whereClause,
        });

        const userMappingsWithUsers = await Promise.all(userMappings.map(async (userMapping) => {
            const userId = userMapping.dataValues.user_id;

            const user = await User.findOne({ where: { id: userId } });

            return {
                ...userMapping.dataValues,
                user: user ? user.dataValues : null,
            };
        }));

        if (userMappingsWithUsers.length > 0) {
            reply.status(200).send({
                status_code: 200,
                items_per_page: userMappingsWithUsers.length,
                total_records: userMappingsWithUsers.length,
                trace_id: generateCustomUUID(),
                data: userMappingsWithUsers,
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: "No User Mappings found for the given criteria",
                user_mappings: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: "Internal Server Error",
            error,
            trace_id: generateCustomUUID(),
        });
    }
};
