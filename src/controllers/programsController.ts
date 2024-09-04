import { Programs } from "../models/programsModel";
import { FastifyRequest, FastifyReply } from "fastify";
import {
  CreateProgramData,
  ProgramQuery,
} from "../interfaces/programsInterface";
import Tenant from "../models/tenantModel";
import { baseSearch } from "../utility/baseService";
import { Op } from "sequelize";
import generateCustomUUID from "../utility/genrateTraceId";
import ProgramConfig from "../models/programsConfigModel";
import Configuration from "../models/configurationModel";
import ProgramModule from "../models/programModuleModel";

export const saveProgram = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { ...programData } = request.body as CreateProgramData;

  try {
    const item: any = await Programs.create({ ...programData });
    reply.status(201).send({
      status_code: 201,
      id: item.id,
      message: "Program Created Successfully",
      trace_id: generateCustomUUID(),
    });

    process.nextTick(async () => {
      try {
        const defaultConfigs = await Configuration.findAll();

        const programConfigs = defaultConfigs.map((config) => {
          const { id, ...configWithoutId } = config.toJSON();
          return {
            program_id: item.id,
            ...configWithoutId,
          };
        });

        await ProgramConfig.bulkCreate(programConfigs);
      } catch (error) {
        console.error("Error in async configuration setup:", error);
      }
    });
  } catch (error: any) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export const getAllProgram = async (
  request: FastifyRequest<{ Querystring: ProgramQuery }>,
  reply: FastifyReply
) => {
  const { name, is_activated, start_date } =request.query as ProgramQuery;

  try {
    const query = request.query as ProgramQuery | any;
    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "10");
    const offset = (page - 1) * limit;
    query.page && delete query.page;
    query.limit && delete query.limit;

    const programs = await Programs.findAll({
      where: {
        is_deleted: false,
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(is_activated !== undefined && {
          is_activated: is_activated === "true" ? 1 : 0,
        }),
        ...(start_date && { start_date: { [Op.gte]: new Date(start_date) } }),
      },
      include: [
        {
          model: Tenant,
          as: "client",
          where: {
            is_deleted: false,
          },
          attributes: ["name", "id", "logo"],
        },
      ],
      attributes: ["id", "name", "is_enabled", "unique_id"],
      order: [['created_on', 'DESC']],
      limit: limit,
      offset: offset,
    });

    const count = await Programs.count({
      where: {
        is_deleted: false,
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(is_activated !== undefined && {
          is_activated: is_activated === "true" ? 1 : 0,
        }),
        ...(start_date && { start_date: { [Op.gte]: new Date(start_date) } }),
      },
    });
    if (programs.length === 0) {
      return reply
        .status(200)
        .send({ message: "Programs not found", programs: [] });
    }
    reply.status(200).send({
      status_code: 200,
      items_per_page: limit, 
      total_records: count, 
      programs: programs,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error('Error in getAllProgram:', error); 
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server error",
      trace_id: generateCustomUUID(),
    });
  }
};

export const getProgramById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  try {
    const programs = await Programs.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
      include: [
        {
          model: Tenant,
          as: "client",
          where: {
            is_deleted: false,
          },
          attributes: ["name", "id", "logo"],
        },
        {
          model: Tenant,
          as: "msp",
          required: false,
          where: {
            is_deleted: false,
          },
          attributes: ["name", "id", "logo"],
        },
      ],
      attributes: [
        "id",
        "name",
        "description",
        "type",
        "start_date",
        "is_enabled",
        "unique_id",
      ],
    });
    if (programs) {
      reply.status(200).send({
        status_code: 200,
        message: "Data fetch successfully",
        data: programs,
        trace_id: generateCustomUUID(),
        program: [],
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: "Programs not found",
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server error",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export const updateProgramById = async (
  request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<CreateProgramData>;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const updates = request.body as Partial<CreateProgramData>;
  try {
    const program = await Programs.findOne({
      where: {
        id: id,
        is_deleted: false,
      },
    });
    if (!program) {
      return reply.status(200).send({
        status_code: 200,
        message: "Program not found",
        trace_id: generateCustomUUID(),
      });
    }
    if (updates.module_groups != null && updates.module_groups.length > 0) {
      let modules = {
        modules: updates.module_groups,
      };
      const updatedProgram: any = await ProgramModule.update(modules, {
        where: { program_id: id }
      });
    }

    const updatedCount: any = await Programs.update(updates, {
      where: { id: id },
    });
    reply.status(200).send({
      status_code: 200,
      id: updatedCount.id,
      message: "Program updated successfully",
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export const deleteProgramById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  try {
    const program = await Programs.findByPk(id);
    if (program) {
      await program.update({
        is_enabled: false,
        is_deleted: true,
      });
      reply.status(204).send({
        status_code: 204,
        message: "Program Deleted Successfully",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: "Program Not Found",
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export async function advancedFilter(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchFields = ["is_enabled", "name"];
  const responseFields = ["id", "name", "type", "is_enabled"];
  return baseSearch(request, reply, Programs, searchFields, responseFields);
}
