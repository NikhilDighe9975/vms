import { FastifyRequest, FastifyReply } from 'fastify';
import IndustriesModel from '../models/industriesModel';
import { IndustriesInterface, } from '../interfaces/industriesInterface';
import generateCustomUUID from '../utility/genrateTraceId';


export async function createIndustries(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const industries = request.body as IndustriesInterface;

    const item: any = await IndustriesModel.create({ ...industries });
    reply.status(201).send({
      statusCode: 201,
      data: item?.id,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while creating',
      error
    });
  }
}

export async function getIndustries(
  request: FastifyRequest<{ Params: IndustriesInterface, Querystring: IndustriesInterface }>,
  reply: FastifyReply
) {
  try {
    const params = request.params as IndustriesInterface;
    const query = request.query as IndustriesInterface | any;

    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;
    query.page && delete query.page;
    query.limit && delete query.limit;
    if (query.is_enabled) {
      query.is_enabled == 'false' ? query.is_enabled = false : query.is_enabled = true;
    }

    const { rows: industries, count } = await IndustriesModel.findAndCountAll({
      where: { ...query, is_deleted: false, program_id: params.program_id },
      attributes: ['id', 'name', 'is_enabled', 'created_on', 'modified_on'],
      limit: limit,
      offset: offset,
    });
    if (industries.length === 0) {
      return reply.status(200).send({ message: "Industries not found", industries: [] });
    }
    reply.status(200).send({
      statusCode: 200,
      items_per_page: limit,
      total_records: count,
      industries: industries,
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


export async function getIndustriesById(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    const item = await IndustriesModel.findOne({
      where: { id, program_id, is_deleted: false },
      attributes: ['id', 'name', 'is_enabled', 'created_on', 'modified_on'],
    });
    if (item) {
      reply.status(200).send({
        statusCode: 200,
        industry_data: item,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Industries not found', industry: [] });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while fetching', error });
  }
}

export async function updateIndustries(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const industries = request.body as IndustriesInterface;
    const [numRowsUpdated] = await IndustriesModel.update(
      { ...industries, modified_on: Date.now() },
      { where: { id } }
    );

    if (numRowsUpdated > 0) {
      reply.status(200).send({
        statusCode: 200,
        industry_id: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(404).send({ message: 'Industries not found' });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while updating', error });
  }
}

export async function deleteIndustries(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    const [numRowsDeleted] = await IndustriesModel.update({
      is_deleted: true,
      is_enabled: false,
      modified_on: Date.now(),
    },
      { where: { id, program_id } }
    );

    if (numRowsDeleted > 0) {
      reply.status(200).send({
        statusCode: 200,
        industry_id: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(404).send({ message: 'Industries not found' });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while deleting', error });
  }
}

export const bulkUploadIndustries = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const Industries = request.body as any[];
    const createdIndustries = await IndustriesModel.bulkCreate(Industries);
    reply.status(201).send({
      status_code: 201,
      data: createdIndustries,
      message: 'Industries Created successfully',
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Failed to create Industries',
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};