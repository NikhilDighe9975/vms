import { FastifyRequest, FastifyReply } from 'fastify';
import { hierarchiesData } from '../interfaces/hierarchiesInterface';
import { baseSearch, advanceSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId';
import hierarchies from '../models/hierarchiesModel';
interface hierarchiesWithChildren {
  id: string;
  parent_hierarchy_id: string | null;
  parent_hierarchy_name?: string;
  hierarchies?: hierarchiesWithChildren[];
}

const fetchHierarchiesWithChildren = async (
  parentId: string,
  currentLevel: number,
  maxLevel: number
): Promise<hierarchiesWithChildren[]> => {
  if (currentLevel > maxLevel) return [];

  const children = await hierarchies.findAll({
    where: { parent_hierarchy_id: parentId }
  });

  const parentHierarchy = parentId ? await hierarchies.findOne({ where: { id: parentId } }) : null;

  const childrenWithDescendants = await Promise.all(
    children.map(async (child) => {
      const childAsHierarchieWithChildren: hierarchiesWithChildren = child.toJSON() as hierarchiesWithChildren;

      if (parentHierarchy) {
        childAsHierarchieWithChildren.parent_hierarchy_name = parentHierarchy.getDataValue('name');
      }

      const descendants = await fetchHierarchiesWithChildren(childAsHierarchieWithChildren.id, currentLevel + 1, maxLevel);
      return { ...childAsHierarchieWithChildren, hierarchies: descendants };
    })
  );
  return childrenWithDescendants;
};

export const getHierarchiesByProgram = async (
  request: FastifyRequest<{ Params: { program_id: string } }>,
  reply: FastifyReply
) => {
  const { program_id } = request.params;

  try {
    const parentHierarchies = await hierarchies.findAll({
      where: { program_id: program_id, parent_hierarchy_id: null }
    });

    if (parentHierarchies.length === 0) {
      return reply.status(200).send({
        status_code: 200,
        message: 'No Hierarchy found for the given program',
        hierarchies: []
      });
    }

    const maxLevel = 3;
    const hierarchiesWithChildren = await Promise.all(
      parentHierarchies.map(async (parentHierarchy) => {
        const parentHierarchyAsHierarchieWithChildren: hierarchiesWithChildren = parentHierarchy.toJSON() as hierarchiesWithChildren;
        const childHierarchies = await fetchHierarchiesWithChildren(parentHierarchyAsHierarchieWithChildren.id, 1, maxLevel);
        return { ...parentHierarchyAsHierarchieWithChildren, hierarchies: childHierarchies };
      })
    );

    reply.status(200).send({
      status_code: 200,
      trace_id: generateCustomUUID(),
      hierarchies: hierarchiesWithChildren,
    });
  } catch (error) {
    console.error('Error fetching hierarchy by program:', error);
    reply.status(500).send({
      status_code: 500,
      message: 'An error occurred while fetching Hierarchy by program',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getHierarchies = async (
  request: FastifyRequest<{ Params: { program_id: string } }>,
  reply: FastifyReply
) => {
  const { program_id } = request.params;
  try {
    const hierarchiesData = await hierarchies.findAll({
      where: {
        program_id,
        is_deleted: false,
      },
      attributes: ['id', 'name', 'code', 'parent_hierarchy_id', 'is_enabled', 'modified_on'],
    });

    if (hierarchiesData.length === 0) {
      return reply.status(200).send({
        status_code: 200,
        message: 'No Hierarchy found for the given program',
        hierarchies: [],
      });
    }

    const hierarchiesWithParents = await Promise.all(
      hierarchiesData.map(async (item) => {
        let parentHierarchyName = null;
        if (item.parent_hierarchy_id) {
          const parentHierarchy = await hierarchies.findOne({
            where: { id: item.parent_hierarchy_id },
            attributes: ['name'],
          });
          parentHierarchyName = parentHierarchy ? parentHierarchy.name : null;
        }

        return {
          ...item.toJSON(),
          parent_hierarchy_name: parentHierarchyName,
        };
      })
    );

    const sortedHierarchies = hierarchiesWithParents.sort((a, b) => {
      if (a.parent_hierarchy_id === null) return -1;
      if (b.parent_hierarchy_id === null) return 1;
      return 0;
    });

    reply.status(200).send({
      status_code: 200,
      trace_id: generateCustomUUID(),
      hierarchies: sortedHierarchies,
    });
  } catch (error) {
    console.error('Error fetching hierarchies:', error);
    reply.status(500).send({
      status_code: 500,
      message: 'An error occurred while fetching hierarchies',
      error: error,
    });
  }
};

export async function getHierarchiesById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const hierarchy = await hierarchies.findByPk(id);
    if (hierarchy) {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        hierarchies: hierarchy
      });
    } else {
      reply.status(200).send({ message: 'Hierarchy not found', hierarchies: [] });
    }
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while fetching Hierarchy by ID',
      error: error,
    });
  }
}

export async function createHierarchies(
  data: Omit<hierarchiesData, '_id'>,
  reply: FastifyReply
) {
  try {
    const newItem = await hierarchies.create(data);
    return reply.status(201).send({
      status_code: 201,
      message: 'Hierarchy Created Successfully',
      data: newItem,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send({ message: 'Failed To Create Hierarchy', error });
  }
}

export async function updateHierarchies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const hierarchiesData = request.body as hierarchiesData;
  try {
    const hierarchie: hierarchies | null = await hierarchies.findByPk(id);
    if (hierarchie) {
      await hierarchie.update(hierarchiesData);
      reply.status(200).send({
        status_code: 200,
        message: "Hierarchy update succesfully",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Hierarchy not found' });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function deleteHierarchies(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const numRowsDeleted = await hierarchies.destroy({ where: { id } });
    if (numRowsDeleted > 0) {
      reply.status(200).send({
        status_code: 200,
        message: 'Hierarchy deleted successfully',
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Hierarchy not found' });
    }
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while deleting Hierarchy',
      error: error,
    });
  }
}

export async function searchHierarchies(request: FastifyRequest<{ Params: { program_id: string } }>, reply: FastifyReply) {
  const { program_id } = request.params;
  const parentHierarchies = await hierarchies.findAll({
    where: { program_id: program_id }
  });

  if (parentHierarchies.length === 0) {
    return reply.status(200).send({
      status_code: 200,
      message: 'No Hierarchy found for the given program',
      hierarchies: []
    });
  }
  const searchFields = ['is_enabled', 'name', 'code'];
  const responseFields = ['id', 'name', 'modified_on', 'is_enabled'];
  return baseSearch(request, reply, hierarchies, searchFields, responseFields);
}

export async function advancedSearchHierarchies(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchFields = ['modified_on'];
  const responseFields = ['id', 'name', 'modified_on', 'is_enabled'];
  return advanceSearch(
    request,
    reply,
    hierarchies,
    searchFields,
    responseFields
  );
}

