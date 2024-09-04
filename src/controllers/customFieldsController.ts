import { FastifyRequest, FastifyReply } from 'fastify';
import customField from '../models/customFieldsModel';
import { customFields } from '../interfaces/customFieldsInterface';
import { baseSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';
import picklistModel from '../models/picklistModel';
import { createCustomFieldLocations } from './customFieldLocationController';
import { saveCustomFieldsHierarchies } from './customFieldHierarchieController';

export const saveCustomFields = async (request: FastifyRequest<{}>, reply: FastifyReply) => {
  const { program_id, work_location_ids, hierarchy_ids, modules, ...customFieldData } = request.body as any;

  if (!program_id) {
    return reply.status(400).send({
      status_code: 400,
      message: 'Program ID is required.',
      trace_id: generateCustomUUID(),
    });
  }

  try {
    console.log(request.body, "request body");

    const customField = await createCustomField({ program_id, ...customFieldData });

    if (!customField || !customField.id) {
      throw new Error('Failed to create custom field');
    }

    const custom_field_id = customField.id;

    const locationPromises = work_location_ids?.map((work_location_id: string) =>
      createCustomFieldLocations(custom_field_id, work_location_id)
    );

    const hierarchyPromises = hierarchy_ids?.map((hierarchy_id: string) =>
      saveCustomFieldsHierarchies(custom_field_id, hierarchy_id)
    );

    await Promise.all([...(locationPromises || []), ...(hierarchyPromises || [])]);

    return reply.status(201).send({
      status_code: 201,
      message: 'Custom field created successfully.',
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error('Error processing custom field:', error);
    return reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
    });
  }
};

export const createCustomField = async (data: any) => {
  try {
    console.log("Data to be inserted:", data);
    const customFieldData = await customField.create(data);
    console.log("Inserted customFieldData:", customFieldData);
    return customFieldData;
  } catch (error) {
    console.error('Error during custom field creation:', error);
    throw error;
  }
};

export async function getAllCustomFields(
  request: FastifyRequest<{ Params: { program_id: string }; Querystring: { page?: string; size?: string } }>,
  reply: FastifyReply
) {
  const programId = request.params.program_id;
  const page = parseInt(request.query.page ?? '1', 10);
  const size = parseInt(request.query.size ?? '10', 10);

  const result = await customField.findAndCountAll({
    where: {
      program_id: programId,
      is_deleted: false,
    },
    attributes: ["id", "name", "is_enabled", "modified_on", "module_id", "module_name", "field_type", "is_required", "label",],   
    offset: (page - 1) * size,
    limit: size,
  });

  reply.status(200).send({
    status_code: 200,
    custom_fields: result.rows,
    total_records: result.count,
    page: page,
    size: size,
    message: 'Custom Fields Get Successfully',
    trace_id: generateCustomUUID(),
  });
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
    const customfiedData = await customField.findOne({
      where: { id, program_id: program_id },
      attributes: ["id", "name", "is_enabled", "modified_on", "can_view", "can_edit", "is_all_hierarchy", "label", "placeholder", "field_type", "is_required", "module_id", "module_name", "supporting_text", "description", "is_readonly", "is_required", "is_linked", "is_deleted", "created_on", "modified_on", "supporting_text"],    });

    if (customfiedData) {
      reply.status(200).send({
        status_code: 200,
        customField: customfiedData,
        message: 'Custom Fields Type Get Successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Custom Fields Type Not Found',
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
  request: FastifyRequest<{ Params: { id: string; program_id: string }; Body: customFields }>,
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
    const [updatedCount] = await customField.update(updates, {
      where: { id, program_id: program_id },
    });

    if (updatedCount > 0) {
      reply.status(201).send({
        status_code: 201,
        message: "Custom field updated successfully.",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'Custom Fields not found', customField:[],
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
    const customFieldItem = await customField.findByPk(id);
    if (customFieldItem) {
      await customFieldItem.update({
        is_enabled: false,
        is_deleted: true,
      });

      reply.status(204).send({
        status_code: 204,
        message: 'custom Field Deleted Successfully',
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

export async function searchCustomFields(request: FastifyRequest, reply: FastifyReply) {
  try {
    const searchFields = ['name', 'module_name', 'field_type', 'is_enabled', 'modified_on', 'label'];
    const responseFields =  ["id", "name", "is_enabled", "modified_on", "module_id", "module_name", "field_type", "is_required", "label",];   
    return await baseSearch(request, reply, customField, searchFields, responseFields);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
