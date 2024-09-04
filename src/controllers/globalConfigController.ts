import { FastifyRequest, FastifyReply } from 'fastify';
import GlobalConfigModel from '../models/globalConfigModel';
import GlobalConfigInterface from '../interfaces/globalConfigInterface';
import generateCustomUUID from '../utility/genrateTraceId';


export async function createGlobalConfig(request: FastifyRequest, reply: FastifyReply) {
  try {
    const industries = request.body as GlobalConfigInterface;
    const item: any = await GlobalConfigModel.create({ ...industries });
    reply.status(201).send({
      status_code: 201,
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


export async function getGlobalConfig(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const query = request.query as GlobalConfigInterface;
    const page = parseInt(query.page ?? '1');
    const limit = parseInt(query.limit ?? '10');
    const offset = (page - 1) * limit;
    query.page && delete query.page;
    query.limit && delete query.limit;
    const { rows: flags, count } = await GlobalConfigModel.findAndCountAll({
      where: { ...query, is_deleted: false },
      attributes: ["id", "name", "slug", "is_enabled",],
      limit: limit,
      offset: offset,
    });
    if(flags.length===0){
      return reply.status(200).send({ message: "GlobalConfig not found",globalConfigs:[] });
    }
    reply.status(200).send({
      status_code: 200,
      items_per_page: limit,
      total_records: count,
      industries: flags,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server error', error: error
    });
  }
}

export async function getGlobalConfigById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const globalConfig = await GlobalConfigModel.findOne({
    where: {
      id: id,
      is_deleted: false,
    },
    attributes: ["id", "name", "slug", "is_enabled"]
  });
  if (globalConfig) {
    reply.status(200).send({
      status_code: 200,
      global_launch_data: globalConfig,
      trace_id: generateCustomUUID(),
    });
  } else {
    reply.status(404).send({
      status_code: 404,
      message: 'Global Config Not Found',
      globalConfig: []
    });
  }
}


export async function updateGlobalConfig(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = request.params as { id: string };
    const { ...config } = request.body as GlobalConfigInterface;
    const globalConfig = await GlobalConfigModel.update({ ...config }, { where: { id } });
    if (globalConfig) {
      reply.send({
        message: 'GlobalConfig Updated Successfully',
        data: globalConfig,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(404).send({
        status_code: 404,
        message: 'Global Config Not Found'
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server error', error: error,
    });
  }
}

export async function updateGlobalConfigFlags(
  request: FastifyRequest<{ Body: { global_launches: { id: string; is_enabled: boolean }[] } }>,
  reply: FastifyReply
) {
  const { global_launches } = request.body;
  try {
    await GlobalConfigModel.sequelize?.transaction(async (t) => {
      await Promise.all(global_launches.map(async (launch) => {
        await GlobalConfigModel.update(
          { is_enabled: launch.is_enabled },
          { where: { id: launch.id }, transaction: t }
        );
      }));
    });
    reply.status(200).send({
      status_code: 200,
      trace_id: generateCustomUUID(),
      message: 'Global launch data updated successfully.',
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'An error occurred while updating data.',
      error: error as Error,
    });
  }
}

export async function deleteGlobalConfig(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const globalConfig = await GlobalConfigModel.findByPk(id);
    if (globalConfig) {
      await globalConfig.update({
        is_enabled: false,
        is_deleted: true,
      })
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: 'Global Config Deleted Successfully'
      });
    } else {
      reply.status(404).send({ message: 'Global Config Not Found' });
    }
  } catch (error) {
    reply
      .status(500)
      .send({
        message: 'An error occurred while deleting GlobalConfig',
        error: error,
      });
  }
}
