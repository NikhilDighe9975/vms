import { FastifyRequest, FastifyReply } from 'fastify';
import qualificationTypeModel from '../models/qualificationTypeModel';
import qualificationType from '../interfaces/qualificationTypeInterface';
import generateCustomUUID from '../utility/genrateTraceId';

export async function getQualificationTypes(
  request: FastifyRequest<{ Params: qualificationType, Querystring: qualificationType }>,
  reply: FastifyReply
) {
  try {
    const params = request.params as qualificationType;
    const query = request.query as qualificationType | any;

    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;
    query.page && delete query.page;
    query.limit && delete query.limit;
    if (query.is_enabled) {
      query.is_enabled == 'false' ? query.is_enabled = false : query.is_enabled = true;
    }
   
    const { rows: qualificationTypes, count } = await qualificationTypeModel.findAndCountAll({
      where: { ...query, is_deleted: false, program_id: params.program_id },
      attributes: ['id', 'name', "code", "description", "is_enabled", "created_on", "created_by"],
      limit: limit,
      offset: offset,
    });
    if (qualificationTypes.length === 0) {
      return reply.status(200).send({ message: "Qualification Type not found", qualificationTypes: [] });
    }
    reply.status(200).send({
      status_code: 200,
      items_per_page: limit,
      total_records: count,
      qualification_type: qualificationTypes,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      statusCode: 500,
      message: 'Internal Server error', error: error
    });
  }
}


export async function createQualificationTypes(
  request: FastifyRequest <{ Params: { program_id: string } }>,
  reply: FastifyReply 
){
  const { program_id} = request.params;
  try{
    const qualification_types = request.body as qualificationType;
    const qualificationType: any = await qualificationTypeModel.create ({ ...qualification_types, program_id });
    reply.status(201).send({
      status_code: 201,
      qualification_type: {
        id: qualificationType?.id,
        qualificationType_name: qualificationType?.qualificationType_name
      }, 
      trace_id: generateCustomUUID(),
    });
  }catch (error) {
    reply.status(500).send({
      message: 'an error occurred while creating the qualification_type',
      error,
    })
  }
}

export const getQualificationTypeById = async (request: FastifyRequest<{ Params: { id: string; program_id: string } }>, reply: FastifyReply) => {
  const { id, program_id } = request.params as { id: string, program_id: string };

  if (!program_id) {
    reply.status(400).send({
      status_code: 400,
      message: 'Program Id is required',
      trace_id: generateCustomUUID(),
    });
    return;
  }

  try {
    const qualificationTypeData = await qualificationTypeModel.findOne({
      where: { id, program_id },
      attributes: ['id', 'name', 'code', 'description', 'is_enabled'],
    });

    if (qualificationTypeData) {
      reply.status(200).send({
        status_code: 200,
        qualificationType: qualificationTypeData,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Qualification Type Not Found',
        trace_id: generateCustomUUID(),
        qualificationType: []
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
      error: (error as Error).message,
    });
  }
};

export const updateQualificationTypes = async (
  request: FastifyRequest<{ Params: { id: string; program_id: string }; Body: qualificationType }>,
  reply: FastifyReply
) => {
  const { id, program_id } = request.params;
  const updates = request.body;

  if (!program_id) {
    reply.status(400).send({
      status_code: 400,
      message: 'Program Id is required',
      trace_id: generateCustomUUID(),
    });
    return;
  }

  try {
    const [updatedCount] = await qualificationTypeModel.update(updates, {
      where: { id, program_id },
    });

    if (updatedCount > 0) {
      reply.status(201).send({
        status_code: 200,
        message: 'Qualification Type updated successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Qualification Type not found',
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error: Failed to update Qualification Type',
      trace_id: generateCustomUUID(),
    });
  }
};

export async function deleteQualificationTypes(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const qualificationType = await qualificationTypeModel.findByPk(id);
    if (qualificationType) {
      await qualificationType.update({
        is_enabled: false,
        is_deleted: true,
      })
      reply.status(200).send({
        status_code: 200,
        message: 'Qualification Type deleted successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Qualification Type not found',
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error: Failed to delete Qualification Type',
      trace_id: generateCustomUUID(),
      error: error as Error,
    });
  }
}