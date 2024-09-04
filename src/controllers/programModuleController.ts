import { FastifyRequest, FastifyReply } from 'fastify';
import ProgramModule from '../models/programModuleModel';
import generateCustomUUID from '../utility/genrateTraceId';
import { Module } from '../models/moduleModel';
import { Op } from 'sequelize';

export const getProgramModuleById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  try {
    const programData: any = await ProgramModule.findOne({
      where: { program_id: id },
      attributes: {
        exclude: ['is_deleted', 'created_on', 'modified_on', 'created_by', 'modified_by']
      },
    });

    if (!programData) {
      return reply.status(200).send({
        status_code: 200,
        message: 'Data not found',
        trace_id: generateCustomUUID(),
      });
    }

    const moduleIds = programData.modules.map((module: any) => module.module_id);
    const modulesData = await Module.findAll({
      where: {
        id: {
          [Op.in]: moduleIds,
        },
      },
      attributes: ['id', 'name', 'description']
    });

    const moduleMap = modulesData.reduce((acc: any, module: any) => {
      acc[module.id] = module;
      return acc;
    }, {});

    const transformedModules = programData.modules.map((module: any) => ({
      module_id: moduleMap[module.module_id],
      is_enabled: module.is_enabled,
    }));

    const program = {
      ...programData.toJSON(),
      modules: transformedModules,
    };

    reply.send({
      status_code: 200,
      data: program,
      trace_id: generateCustomUUID()
    });
  } catch (error) {
    return reply.status(500).send({ error });
  }
};