import { FastifyRequest, FastifyReply } from 'fastify';
import customFieldHierarchie from '../models/customFieldHierarchieModel';
import { customFieldHierarchieInterface } from '../interfaces/customFieldHierarchieInterface';
import { baseSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';

export const saveCustomFieldsHierarchie = async (
  request: FastifyRequest<{}>,
  reply: FastifyReply
) => {
  const {...customFieldData } = request.body as customFieldHierarchieInterface;

  try {

    const item: any = await customFieldHierarchie.create({
      ...customFieldData
    });

    reply.status(201).send({
      status_code: 201,
      customfield_data: {
        id: item.id,
      },
      message: 'Custom field hierarchie created successfully',
      trace_id: generateCustomUUID(),
    });
  } catch (error: any) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
      error: error.message
    });
  }
};

export const getCustomFieldById = async (request: FastifyRequest<{ Params: { id: string; program_id: string } }>, reply: FastifyReply) => {
  const { id, program_id } = request.params;

  if (!program_id) {
    reply.status(400).send({
      status_code: 400,
      message: 'Program ID is required',
      trace_id: generateCustomUUID(),
    });
    return;
  }

  try {
    const customfiedData = await customFieldHierarchie.findOne({
      where: { id, program_id: program_id },
      attributes: ['id', 'customField_id', 'program_id', 'is_enabled','hierarchie_id'],
    });

    if (customfiedData) {
      reply.status(200).send({
        status_code: 200,
        customField: customfiedData,
        message: 'Custom Fields Hierarchie Get Successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Custom Fields hierarchie Type Not Found',
        trace_id: generateCustomUUID(),
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

export const updateCustomFieldById = async (
  request: FastifyRequest<{ Params: { id: string; program_id: string }; Body: customFieldHierarchieInterface }>,
  reply: FastifyReply
) => {
  const { id, program_id } = request.params;
  const updates = request.body;

  if (!program_id) {
    reply.status(400).send({
      status_code: 400,
      message: 'Program ID is required',
      trace_id: generateCustomUUID(),
    });
    return;
  }

  try {
    const [updatedCount] = await customFieldHierarchie.update(updates, {
      where: { id, program_id: program_id },
    });

    if (updatedCount > 0) {
      reply.status(201).send({
        status_code: 201,
        message: "Custom field hierarchie updated successfully.",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Custom Fields hierarchie not found', customField:[],
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error: Failed to update Custom Fields',
      trace_id: generateCustomUUID(),
    });
  }
};

export const deleteCustomField = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const customFieldItem = await customFieldHierarchie.findByPk(id);
    if (customFieldItem) {
      await customFieldItem.update({
        is_enabled: false,
        is_deleted: true,
      });

      reply.status(204).send({
        status_code: 204,
        message: 'custom Field hierarchie Deleted Successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(404).send({
        status_code: 404,
        message: 'custom Field Not Found',
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
      error: error
    });
  }
};


export async function searchCustomFields(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
    const { program_id } = request.params;
    const customField = await customFieldHierarchie.findAll({
      where: { program_id: program_id }
    });

    if (customField.length === 0) {
      return reply.status(404).send({
        status_code: 404,
        message: 'No Custom field hierarchie found for the given program',
        customFieldHierarchie: []
      });
    }
    const searchFields = ['hierarchie_id','customField_id','is_enabled'];
    const responseFields = ['id', 'hierarchie_id','program_id','is_enabled','customField_id','created_on'];
    return baseSearch(request, reply, customFieldHierarchie, searchFields, responseFields);
  }


export const saveCustomFieldsHierarchies = async (custom_field_id: string, hierarchy_id: string) => {
  try {
    const customFieldHierarchieData = await customFieldHierarchie.create({
      custom_field_id,
      hierarchy_id,
    });
    return customFieldHierarchieData;
  } catch (error) {
    console.error('Error during custom field hierarchie creation:', error);
    throw error;
  }
};