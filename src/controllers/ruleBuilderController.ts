import { FastifyRequest, FastifyReply } from 'fastify';
import generateCustomUUID from '../utility/genrateTraceId';
import { baseSearch } from '../utility/baseService';
import { ruleBuilderAttributes } from '../interfaces/ruleBuilderInterface';
import ruleBuilderModel from '../models/ruleBuilderModel';


export async function getAllRules(
  request: FastifyRequest<{ Params: { program_id: string }, Querystring: { page?: string, limit?: string } }>,
  reply: FastifyReply
) {
  const { program_id } = request.params;
  try {
    const query = request.query || {};
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '10', 10);
    const offset = (page - 1) * limit;
    const {rows,count} = await ruleBuilderModel.findAndCountAll({
      where: { is_deleted: false, program_id, },
      limit: limit,
      offset: offset,
    });
 
    reply.status(200).send({
      status_code: 200,
      items_per_page: limit,
      total_records: count,
      rules: rows,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      error: error,
    });
  }
}

export async function createRule(
  request: FastifyRequest<{ Params: { program_id: string } }>,
  reply: FastifyReply
) {
  const { program_id } = request.params;
  try {
    const rulebuilder = request.body as ruleBuilderAttributes;
    const rule: any = await ruleBuilderModel.create({ ...rulebuilder, program_id });
    reply.status(201).send({
      status_code: 201,
      rule: {
        id: rule?.id,
        rule_name: rule?.rule_name,
      },
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while creating the rule',
      error,
    });
  }
}

export async function getRuleById(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    const rule = await ruleBuilderModel.findOne({
      where: { id, program_id },
    });

    if (rule) {
      reply.status(200).send({
        status_code: 200,
        rule: rule,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Rule not found' });
    }
  } catch (error) {
    
    reply.status(500).send({
      status_code: 500,
      message: 'An error occurred while fetching the rule',
      error: error,
    });
  }
}

export const updateRuleById = async (
  request: FastifyRequest<{ Params: { id: string, program_id: string }, Body: ruleBuilderAttributes }>,
  reply: FastifyReply
) => {
  const { id, program_id } = request.params;
  const updatedPayload = request.body as ruleBuilderAttributes;

  try {
    const rule = await ruleBuilderModel.findOne({
      where: { id, program_id }
    });
    if (rule) {
      await rule.update(updatedPayload);

      reply.status(201).send({
        status_code: 201,
        rule: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Rule not found' });
    }
  } catch (error) {
    reply.status(500).send({
      message: 'Failed to update rule',
      trace_id: generateCustomUUID(),
      error,
    });
  }
};

export const deleteRuleById = async (
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) => {
  const { id, program_id } = request.params;

  try {
    const rule = await ruleBuilderModel.findOne({
      where: { id, program_id }
    });
    if (rule) {
      await rule.update({ is_deleted: true , is_enabled: false,});
      reply.status(204).send({
        status_code: 204,
        rules: id,
        trace_id: generateCustomUUID(),
         message: 'Rule is delete'
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: 'Rule not found'
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Error marking rule as deleted',
      error: error,
    });
  }
};


export async function searchRule(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['id', ',rule_code', 'status', 'rule_name', 'module_id', 'rule_event_id', 'rule_type', 'updated_by'];
  const responseFields = ['id', 'rule_code', 'status', 'rule_name', 'module_id', 'rule_event_id', 'rule_type', 'updated_by'];
  return baseSearch(request, reply, ruleBuilderModel, searchFields, responseFields);
}