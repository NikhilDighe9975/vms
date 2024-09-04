
import customFieldLocation from '../models/customFieldLocationModel';
import { customFieldLocationInterface } from '../interfaces/customFieldLocationInterface';
import { FastifyReply, FastifyRequest } from 'fastify';
import { baseSearch } from '../utility/baseService'
import generateCustomUUID from '../utility/genrateTraceId';

export async function createCustomFieldLocation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const custom_Field_Location = request.body as customFieldLocationInterface;
    const custom_field_loc: any = await customFieldLocation.create({ ...custom_Field_Location });
    reply.status(201).send({
      status_code: 201,
      message: "custom field location created succesfully",
      fees_config: custom_field_loc?.id,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while creating custom field location',
      error
    });
  }
}

export async function getCustomFieldLocationById(
  request: FastifyRequest<{ Params: { id: string,program_id:string } }>,
  reply: FastifyReply
) {
  try {
    const { id,program_id } = request.params;
    const custom_Field_Location = await customFieldLocation.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      },
      attributes: ['id', 'program_id', 'custom_field_id', 'location_id', 'is_enabled',
        'is_deleted', 'created_on', 'modified_on']
    });
    if (custom_Field_Location) {
      reply.status(201).send({
        status_code: 201,
        message: "custom field location get succesfully",
        custom_Field_Locations: custom_Field_Location,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'custom field location data not found',
        fees_config: [],
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while fetching custom field location', error });
  }
}

export async function updateCustomFieldLocationById(request: FastifyRequest, reply: FastifyReply) {
  const { id, program_id } = request.params as { id: string, program_id: string };
  const updates = request.body as Partial<customFieldLocationInterface>;
  try {
    const [custom_field_loc] = await customFieldLocation.update(updates, {
      where: { id, program_id }
    });

    if (custom_field_loc === 0) {
      return reply.status(200).send({ message: 'custom field location not found', custom_field_loc: [] });
    }

    return reply.status(201).send({
      status_code: 201,
      message: 'custom field location updated successfully',
      custom_Field_Locations: id,
      trace_id: generateCustomUUID()
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Internal Server Error', trace_id: generateCustomUUID(), error });
  }
}

export async function deleteCustomFieldLocationById(
  request: FastifyRequest<{ Params: { id: string, program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    const [custom_Field_Location] = await customFieldLocation.update(
      {
        is_deleted: true,
        is_enabled: false,
        modified_on: Date.now(),
      },
      { where: { id, program_id } }
    );
    if (custom_Field_Location > 0) {
      reply.status(200).send({
        status_code: 200,
        message: "custom field location deleted successfully",
        custom_Field_Locations: custom_Field_Location,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'custom field location not found', trace_id: generateCustomUUID(), custom_Field_Location: [] });
    }
  } catch (error) {
    reply.status(500).send({ message: 'Internal Serever Error' });
  }
}
export async function getAllCustomFieldLocation(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['custom_field_id','location_id'];
  const responseFields = ['id', 'program_id', 'custom_field_id', 'location_id', 'is_enabled',
    'is_deleted', 'created_on', 'modified_on',];
  return baseSearch(request, reply, customFieldLocation, searchFields, responseFields);
}

export async function createCustomFieldLocations(custom_field_id: string, work_location_id: string) {
  try {
    const customFieldLocationData = await customFieldLocation.create({
      custom_field_id,
      work_location_id,
    });
    return customFieldLocationData;
  } catch (error) {
    console.error('Error during custom field location creation:', error);
    throw error;
  }
}