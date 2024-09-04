import { rateType } from "../models/rateTypeModel";
import { FastifyRequest, FastifyReply } from "fastify";
import { CreateRateTypeData } from "../interfaces/rateTypeInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import RateTypeHierarchy from "../models/rateTypeHierarchyModel";
import RateTypeJobTemplate from "../models/rateTypeJobTemplateModel";
export const saveRateType = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as CreateRateTypeData;
  const program_id = data.program_id
  if (data.hierarchy_unit_ids) {
    for (const hierarchyId of data.hierarchy_unit_ids) {
      await RateTypeHierarchy.create({
        program_id,
        hierarchy_id:hierarchyId,
        is_enabled: true,
        is_deleted: false,
      });
    }
  }
  if (data.job_template_unit_ids) {
    for (const jobTemplateId of data.job_template_unit_ids) {
      await RateTypeJobTemplate.create({
        program_id,
        job_template_id: jobTemplateId,
        is_enabled: true,
        is_deleted: false,
      });
    }
  }
  if (!data.associate_all_hierarchy && (!data.hierarchy_unit_ids || data.hierarchy_unit_ids.length === 0)) {
    return reply.status(400).send({
      status_code: 400,
      trace_id: generateCustomUUID(),
      message: "The all hierarchies are not associated add particular hierarchies.",
    });
  }

  if (!data.associate_all_job_template && (!data.job_template_unit_ids || data.job_template_unit_ids.length === 0)) {
    return reply.status(400).send({
      status_code: 400,
      trace_id: generateCustomUUID(),
      message: "All job templates are not associated add particular job templates.",
    });
  }
  try {
    const item: any = await rateType.create({ ...data });
    reply.status(201).send({
      status_code: 201,
      id: item.id,
      message: "Data Created Successfully",
      trace_id: generateCustomUUID(),
    });
  } catch (error: any) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error
    });
  }
};

export async function getAllRateType(
  request: FastifyRequest<{ Querystring: CreateRateTypeData }>,
  reply: FastifyReply
) {
  try {
    const params = request.params as CreateRateTypeData;
    const query = request.query as CreateRateTypeData | any;

    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "10");
    const offset = (page - 1) * limit;
    query.page && delete query.page;
    query.limit && delete query.limit;

    if (query.is_enabled) {
      query.is_enabled === "false"
        ? (query.is_enabled = false)
        : (query.is_enabled = true);
    }

    let order: [string, string][] = [["modified_on", "DESC"]];
    if (query.sort === "1") {
      order = [["modified_on", "ASC"]];
    } else if (query.sort === "-1") {
      order = [["modified_on", "DESC"]];
    }

    const rateTypeResponse = await rateType.findAll({
      where: { ...query, program_id: params.program_id, is_deleted: false },
      limit,
      offset,
      order,
      attributes: {
        exclude: ["is_deleted", "program_id", "ref_id"],
      }
    });

    const count = await rateType.count({ where: { ...query, program_id: params.program_id, is_deleted: false }, });

    return reply.status(200).send({
      status_code: 200,
      items_per_page: limit,
      total_records: count,
      rate_type: rateTypeResponse,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error,
    });
  }
}

export async function getRateTypeById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id, program_id } = request.params as {
    id: string;
    program_id: string;
  };
  if (!id || !program_id) {
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Invalid parameters"
    });
  }
  try {
    const rateTypes = await rateType.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["is_deleted", "program_id", "ref_id"],
      }
    });
    if (rateTypes) {
      return reply.status(200).send({
        status_code: 200,
        rate_type: rateTypes,
        trace_id: generateCustomUUID(),
      });
    } else {
      return reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: "Rate Type Not Found"
      });
    }
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Failed To Retrieve Rate Type", error
    });
  }
}

export const updateRateTypeById = async (request: FastifyRequest<{ Params: { id: string }, Body: Partial<CreateRateTypeData> }>, reply: FastifyReply) => {
  const { id } = request.params;
  const updates = request.body as Partial<CreateRateTypeData>;
  try {
    const rateTypes = await rateType.findOne({
      where: {
        id: id,
        is_deleted: false
      }
    });
    if (!rateTypes) {
      return reply.status(200).send({
        status_code: 200,
        message: "Rate Types not found",
        trace_id: generateCustomUUID(),
      });
    }
    const updatedCount: any = await rateType.update(updates, {
      where: { id: id }
    });
    reply.status(200).send({
      status_code: 200,
      id: updatedCount.id,
      message: "Rate Type updated successfully",
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error
    });
  }
};

export const deleteRateTypeById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const rateTypes = await rateType.findByPk(id);
    if (rateTypes) {
      await rateTypes.update({
        is_enabled: false,
        is_deleted: true,
      })
      reply.status(204).send({
        status_code: 204,
        message: "Rate Type Deleted Successfully",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: "Rate Type Not Found",
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Internal Server Error",
      trace_id: generateCustomUUID(),
      error: error
    });
  }
};


