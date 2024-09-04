import { FastifyRequest, FastifyReply } from "fastify";
import User from "../models/userModel";
import { UserInterface } from "../interfaces/userInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import { baseSearch } from "../utility/baseService";
import hierarchies from "../models/hierarchiesModel";
import { UserMappingAttributes } from "../interfaces/usermappingInterface";
import UserMapping from "../models/usermappingModel";
import { trace } from "console";
import { sequelize } from "../plugins/sequelize";
import { Op } from "sequelize";

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const result = await User.findAndCountAll({
    where: {
      is_deleted: false,
    },
    attributes: ["id", "name_prefix", "first_name", "middle_name", "last_name", "username", "name_suffix", "program_id", "email",
      "avatar", "country_id", "is_enabled", "is_activated", "is_deleted"
    ]
  });
  if (result.rows.length === 0) {
    return reply.status(200).send({
      message: "Users not found",
      users: []
    });
  }
  reply.status(200).send({
    status_code: 200,
    users: result.rows,
  });
}
export async function getUserById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const user = await User.findByPk(id);
    if (user) {
      return reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        user: user,
      });
    } else {
      reply.status(200).send({
        message: "User not found",
        user: []
      });
    }
  } catch (error) {
    reply.status(500).send({
      message: "Internal server error",
      error: error,
      trace_id: generateCustomUUID(),
    });
  }
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const transaction = await sequelize.transaction();
  try {
    const { user, user_group_mapping } = request.body as {
      user: UserInterface;
      user_group_mapping: Omit<UserMappingAttributes, "id">;
    };

    if (!user || !user.program_id) {
      await transaction.rollback();
      return reply.status(400).send({
        message: "Missing user or program_id in request body"
      });
    }

    const existingUser = await User.findOne({
      where: {
        program_id: user.program_id,
        id: user.id,
      },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return reply.status(400).send({
        message: "User with program_id already exists!"
      });
    }

    const newUser = await User.create({ ...user }, { transaction });

    await UserMapping.create({ ...user_group_mapping }, { transaction });

    await transaction.commit();
    return reply.status(201).send({
      status_code: 201,
      data: newUser?.id,
      trace_id: generateCustomUUID(),
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0].path;
      return reply.status(400).send({
        error: `${field} already in use!`
      });
    }
    return reply.status(500).send({
      message: "Internal server error",
      error,
      trace_id: generateCustomUUID(),
    });
  }
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id, program_id } = request.params as { id: string, program_id: string };
  const updates = request.body as Partial<UserInterface>;
  try {
    const [user] = await User.update(updates, {
      where: { id, program_id }
    });

    if (user === 0) {
      return reply.status(200).send({
        message: "User not found",
        user: []
      });
    }

    return reply.status(201).send({
      status_code: 201,
      message: "User updated successfully",
      user_data: id,
      trace_id: generateCustomUUID()
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error
    });
  }
}

export async function deleteUser(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const numRowsDeleted = await User.destroy({ where: { id } });
    if (numRowsDeleted > 0) {
      return reply.status(201).send({
        status_code: 201,
        message: "User deleted succesfully",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: "User not found" });
    }
  } catch (error) {
    reply.status(500).send({
      message: "An error occurred while deleting User",
      error: error,
    });
  }
}

export async function getAllUserIDAndUserId(request: FastifyRequest, reply: FastifyReply) {
  const { program_id } = request.params as { program_id: string };
  const { user_id, info_level } = request.query as { user_id?: string; info_level?: string };

  try {
    const whereClause: any = {
      is_deleted: false,
      program_id,
    };

    if (user_id) {
      whereClause.id = user_id;
    }

    let attributes: string[] | undefined = [
      "id", "name_prefix", "first_name", "middle_name", "last_name", "username",
      "name_suffix", "program_id", "email", "avatar", "country_id",
      "is_enabled", "is_activated", "is_deleted"
    ];

    if (info_level === "detail") {
      attributes = undefined;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes,
    });

    const totalCount = await User.count({
      where: whereClause,
    });

    reply.status(200).send({
      status_code: 200,
      users: users,
      total_count: totalCount,
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
}
export async function searchUser(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['is_enabled', 'program_id', 'first_name'];
  const responseFields = ['id', 'program_id', 'country_id', 'title', 'name_prefix', 'middle_name', 'is_enabled', 'addresses', 'contacts', 'name_suffix', 'email', 'created_on', 'modified_on', 'created_by', 'modified_by', 'is_deleted', 'ref_id'];
  return baseSearch(request, reply, User, searchFields, responseFields);
}