
import feesConfiguration from '../models/feesConfigModel';
import { feesConfigurationInterface } from '../interfaces/feesConfigInterface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { baseSearch, advanceSearch } from '../utility/baseService'
import generateCustomUUID from '../utility/genrateTraceId';

export async function createFeesConfiguration(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const feesConfig = request.body as feesConfigurationInterface;
    const fees: any = await feesConfiguration.create({ ...feesConfig });
    reply.status(201).send({
      status_code: 201,
      message: "fess configration created succesfully",
      fees_config: fees,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while creating fees configuration',
      error
    });
  }
}

export async function getFeesConfigurationById(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    console.log('Params:', id, program_id);
    const fees = await feesConfiguration.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      }
    });
    if (fees) {
      reply.status(201).send({
        status_code: 201,
        message: "fess configration get succesfully",
        fees: fees,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code :200,
         message: 'fees configuration data not found',
         fees_config: []});
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while fetching fees configuration', error });
  }
}
export async function updateFeesConfigurationById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const updates = request.body as Partial<feesConfigurationInterface>;
  try {
    const feesConfigData = await feesConfiguration.findByPk(id);
    if (!feesConfigData) {
      return reply.status(200).send({ message: 'fees configuration data not found' });
    }
    const [feesConfig] = await feesConfiguration.update(updates, { where: { id } });
    return reply.status(201).send({
      status_code: 201,
      message: 'fees configuration updated successfully',
      fees_config: feesConfig,
      trace_id: generateCustomUUID()
    });
  } catch (error) {
    console.error('error updating fees configuration fees configuration', error);
    return reply.status(500).send({ message: 'Internal Server Error', error });
  }
}

export async function deleteFeesConfigurationById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const [feesConfig] = await feesConfiguration.update(
      {
        is_deleted: true,
        is_enabled: false,
        modified_on: Date.now(),
      },
      { where: { id } }
    );
    if (feesConfig > 0) {
      reply.status(200).send({
        status_code: 200,
        message: "Fees configuration deleted successfully",
        feesConfig: feesConfig,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Fees configuration not found' });
    }
  } catch (error) {
    console.error('Error deleting fees configuration:', error);
    reply.status(500).send({ message: 'An error occurred while deleting fees configuration', error });
  }
}
export async function getAllFeesConfigByProgramId(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
  const { program_id } = request.params;
  const feesConfig = await feesConfiguration.findAll({
    where: { program_id: program_id }
  });
  if (feesConfig.length === 0) {
    return reply.status(200).send({
      status_code: 200,
      message: 'fees configuration data not found for the given program',
      fees_config: []
    });
  }
  const searchFields = ['title', 'status', 'source_model', 'labor_category', 'hierarchy_levels', 'vendors'];
  const responseFields = ['id', 'title', 'status', 'labor_category', 'hierarchy_levels', 'vendors', 'is_enabled', 
        'is_deleted', 'program_id', 'created_on', 'modified_on', 'ref_id',];
  return baseSearch(request, reply, feesConfiguration, searchFields, responseFields);
}


export async function advancedSearchFeesConfiguration(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['hierarchy_levels', 'labor_category', 'vendors', 'select_modules', 'select_category'];
  const responseFields = ['id', 'title', 'status', 'labor_category', 'hierarchy_levels', 'vendors', 'is_enabled', 
        'is_deleted', 'program_id', 'created_on', 'modified_on', 'ref_id',];
  return advanceSearch(request, reply, feesConfiguration, searchFields, responseFields);
}
