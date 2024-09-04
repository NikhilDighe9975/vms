import { FastifyRequest, FastifyReply } from 'fastify';
import picklist_model from '../models/picklistModel';
import { picklist, PicklistItem } from '../interfaces/picklistInterface';
import { Programs } from "../models/programsModel"
import picklist_item_model from '../models/picklistItemModel';
import generateCustomUUID from '../utility/genrateTraceId';
import { sequelize } from '../plugins/sequelize';
export async function getPicklistById(request: FastifyRequest, reply: FastifyReply) {
  const { program_id } = request.params as { program_id: string };
  const { slug } = request.query as { slug?: string }; // Make slug optional
  try {
    const whereClause: any = {
      program_id,
      is_deleted: false,
    };

    // Conditionally add slug to the where clause if it's provided
    if (slug) {
      whereClause.slug = slug;
    }
    const picklists = await picklist_model.findAll({
      where: whereClause,

      include: [
        {
          model: picklist_item_model,
          as: 'picklistItems',
          where: {
            is_deleted: false,
          },
          required: false, // Allows picklists without items to be included
        },
      ],
    });

    const data = picklists.map((picklist: any) => ({
      id: picklist.id,
      name: picklist.name,
      picklist_id: picklist.picklist_id,
      description: picklist.description,
      slug: picklist.slug,
      is_enabled: picklist.is_enabled,
      modified_on: picklist.modified_on,
      disabled_program: picklist.disabled_program,
      is_visible: picklist.is_visible,
      program_id: picklist.program_id,
      defined_by: picklist.defined_by,
      picklist_items_count: picklist.picklistItems.length,
      picklist_items: picklist.picklistItems.map((item: any) => ({
        id: item.id,
        label: item.label,
        defined_by: item.defined_by,
        value: item.value,
        program_id: item.program_id,
        meta_data: item.meta_data,
      })),
    }));

    reply.status(200).send({
      status_code: 200,
      trace_id: generateCustomUUID(),
      picklists: data, // This will be an empty array if no picklists are found
    });

  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'An error occurred while fetching the picklists',
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
}


const generateRandomPrefix = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }
  return result;
};

export const createPicklist = async (request: FastifyRequest<{ Body: any, Params: { program_id: string } }>, reply: FastifyReply) => {
  const { picklist_items, ...picklist_data } = request.body as { picklistItems?: PicklistItem[];[key: string]: any };
  const { program_id } = request.params;

  try {
    const programData = await Programs.findOne({ where: { id: program_id } });
    if (!programData) {
      return reply.status(404).send({
        message: "Program not found",
        status_code: 404,
        trace_id: generateCustomUUID(),
      });
    }
    const typed_picklist_data: Omit<picklist, 'picklist_items'> = picklist_data as Omit<picklist, 'picklist_items'>;
    const transaction = await sequelize.transaction();

    const idPrefix = generateRandomPrefix();
    const uniqId = programData.unique_id;
    const generatedPicklistId = `${uniqId}-PL-${idPrefix}`;
    console.log(generatedPicklistId);
    typed_picklist_data.picklist_id = generatedPicklistId;

    try {
      const picklist = await picklist_model.create(typed_picklist_data, { transaction });

      if (picklist_items && picklist_items.length > 0) {
        const items = picklist_items.map((item: PicklistItem) => ({
          ...item,
          picklist_id: picklist.id, // Link the item to the created picklist
        }));

        await picklist_item_model.bulkCreate(items, { transaction });
      }

      await transaction.commit();

      reply.status(201).send({
        message: "picklist saved successfully.",
        status_code: 201,
        trace_id: generateCustomUUID(),
      });
    } catch (error) {
      // Rollback the transaction if any error occurs
      await transaction.rollback();
      
      reply.status(500).send({
        status_code: 500,
        message: `Error creating picklist: ${error}.`,
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    
    reply.status(500).send({
      status_code: 500,
      message: `Error fetching picklist data: ${error}`,
      trace_id: generateCustomUUID(),
    });
  }
};

export async function deletePicklist(request: FastifyRequest, reply: FastifyReply) {
  const { id, program_id } = request.params as { id: string; program_id: string };

  // Find the picklist using a combination of id and program_id
  const picklist = await picklist_model.findOne({
    where: { id, program_id },
  });

  if (picklist) {
    // Update the picklist to mark it as deleted and disabled
    await picklist.update({
      is_enabled: false,
      is_deleted: true,
    });

    return reply.status(200).send({
      status_code: 200,
      message: "Picklist successfully deleted",
      trace_id: generateCustomUUID(),
    });
  } else {
    return reply.status(200).send({
      status_code: 200, // Corrected the typo here
      message: `Picklist not found`,
      trace_id: generateCustomUUID(), // Added missing parentheses
    });
  }
}

export const updatePicklistAndItem = async (
  request: FastifyRequest<{ Params: { id: string }; Body: picklist }>,
  reply: FastifyReply
) => {
  const { id, program_id } = request.params as { id: string, program_id: string };
  const { picklist_items, ...picklist_data } = request.body;

  const picklist = await picklist_model.findOne({
    where: { id, program_id },
  });

  if (!picklist) {
    return reply.status(200).send({
      status_code: 200,
      message: `Picklist with ID ${id} not found`,
      trace_id: generateCustomUUID(),
    });
  }

  const transaction = await sequelize.transaction();

  try {
    // Update the picklist
    await picklist.update(picklist_data, { transaction });

    // Check if picklistItems exists before updating them
    if (picklist_items && picklist_items.length > 0) {
      for (const item of picklist_items) {
        // Find each picklist item by a unique identifier, for example, 'label' and 'program_id'
        const existingPicklistItem = await picklist_item_model.findOne({
          where: {
            picklist_id: id,
            id: item.id,
          },
          transaction,
        });

        if (!existingPicklistItem) {
          await transaction.rollback();
          return reply.status(200).send({
            status_code: 200,
            message: `PicklistItem with label "${item.label}" and program_id "${item.program_id}" not found`,
            trace_id: generateCustomUUID(),
          });
        }

        // Update the found picklist item
        await existingPicklistItem.update(item, { transaction });
      }
    }

    await transaction.commit();

    return reply.status(200).send({
      status_code: 200,
      message: "Successfully updated picklist and items",
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    await transaction.rollback();
  
    return reply.status(500).send({
      status_code: 500,
      message: `Error updating picklist and items: ${error}`,
      trace_id: generateCustomUUID(),
    });
  }
};

export const getPicklistAndPicklistItem = async (
  request: FastifyRequest<{ Params: { program_id: string; picklist_id: string } }>,
  reply: FastifyReply
) => {
  const { program_id, picklist_id } = request.params;

  // Validate that the parameters are not undefined or null
  if (!program_id || !picklist_id) {
    return reply.status(400).send({
      status_code: 400,
      message: 'Program ID and Picklist ID are required',
    });
  }

  try {
    const picklists = await picklist_model.findAll({
      where: {
        program_id,
      },
      attributes: {
        exclude: ['is_deleted', 'created_on', 'created_by', 'modified_by'],
      },
      include: [
        {
          model: picklist_item_model,
          as: 'picklistItems',
          where: { picklist_id, program_id, is_deleted: false },
          required: true,
          attributes: {
            exclude: ['is_deleted', 'created_on', 'modified_on', 'created_by', 'modified_by'],
          },
        },
      ],
    });

    if (picklists.length > 0) {
      // Assuming you want to return the first picklist as an object
      const picklist = picklists[0];
      const response = {
        status_code: 200,
        trace_id: generateCustomUUID(),
        picklist,
      };

      reply.status(200).send(response);
    } else {
      reply.status(200).send({
        status_code: 200,
        message: 'No picklists found for the given criteria',
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
    });
  }
};

export async function getAllPickListByProgramId(request: FastifyRequest<{ Querystring: { name?: string, picklist_id?: string, program_id?: string, label?: string } }>, reply: FastifyReply) {
  const { name, picklist_id, program_id, label } = request.query;
  try {
    const whereCondition: any = {};
    if (name) {
      whereCondition.name = name;
    }
    if (program_id) {
      whereCondition.program_id = program_id;
    }
    if (picklist_id) {
      whereCondition.id = picklist_id;
    }
    const picklistData = await picklist_model.findAll({
      where: whereCondition,
      include: [
        {
          model: picklist_item_model,
          as: "picklistItems",
          where: {
            is_deleted: false,
            ...(label && { label }),
            ...(program_id && { program_id }),
            ...(picklist_id && { picklist_id }),
          },
          required: false,
          attributes: {
            exclude: ["created_on", "modified_on", "created_by", "modified_by"],
            include: ["picklist_id", "label", "value", "is_deleted", "is_enabled", "defined_by"],
          },
        },
      ],
    });

    if (picklistData.length === 0) {
      return reply.status(200).send({
        status_code: 200,
        message: "Pick list data not found",
        picklist_data: [],
      });
    }

    const responseData = picklistData.map(picklist => ({
      id: picklist.id,
      program_id: picklist.program_id,
      name: picklist.name,
      is_enabled: picklist.is_enabled,
      is_deleted: picklist.is_deleted,
      is_visible: picklist.is_visible,
      created_on: picklist.created_on,
      picklistItems: picklist.picklistItems.map((item: any) => ({
        picklist_id: item.picklist_id,
        label: item.label,
        value: item.value,
        is_deleted: item.is_deleted,
        is_enabled: item.is_enabled,
        defined_by: item.defined_by,
      })),
    }));

    return reply.status(200).send({
      status_code: 200,
      message: "Pick list data retrieved successfully",
      picklist_data: responseData,
    });
  } catch (error) {
    return reply.status(500).send({
      status_code: 500,
      message: "An error occurred while retrieving pick list data",
    });
  }
}

