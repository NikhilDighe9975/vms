import { FastifyRequest, FastifyReply } from "fastify";
import ProgramsConfig from "../models/programsConfigModel";
import { ProgramConfigAttributes } from "../interfaces/programConfigInterface";
import generateCustomUUID from '../utility/genrateTraceId';
import { Op } from "sequelize";

export const getConfigurations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const configurations = await ProgramsConfig.findAll({order: [["sr_Number", "ASC"]]});
  if (configurations.length === 0) {
    return reply.status(200).send({ message: "Configuration Not Found", hierarchies: [] });
  }
  reply.send({
    status_code: 200,
    message: "Configurations fetched successfully",
    program_configurations: configurations,
    trace_id: generateCustomUUID(),
  });
};

export const getConfigurationById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const configuration = await ProgramsConfig.findByPk(id);
  if (configuration) {
    reply.send({
      status_code: 200,
      message: "Configuration fetched successfully",
      program_configuration: configuration,
      trace_id: generateCustomUUID(),
      });
  } else {
    reply.status(200).send({ message: "Configuration Not Found", programsConfig: [] });
  }
};

export const createConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const configData = request.body as Partial<ProgramConfigAttributes>;
  const newConfiguration = await ProgramsConfig.create(configData);
  reply.status(200).send({
    status_code: 200,
    message: "program configuration created successfully",
    trace_id: generateCustomUUID(),
  });
};

export const updateConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { program_id } = request.params as { program_id: string };
    const configs = request.body as Array<Partial<ProgramConfigAttributes & { id: string; value: any }>>;

    const updatedConfigurations = [];

    for (const configData of configs) {
      const { id, value } = configData;

      const configuration = await ProgramsConfig.findOne({
        where: {
          id,
          program_id,
        },
      });

      if (configuration) {
        await configuration.update({ value });
        updatedConfigurations.push(configuration);
      } else {
        return reply
          .status(200)
          .send({ message: `Configuration With ID ${id} Not Found` });
      }
    }

    reply.status(200).send({
      status_code: 200,
      message: `Configuration  has been updated  `,
      updatedConfigurations: updatedConfigurations,
      trace_id: generateCustomUUID() 
    });
  } catch (error) {
    reply
      .status(500)
      .send({
        stutus_code: 500,
        message: "Failed to update the configurations", error,
        trace_id: generateCustomUUID(),
      });
  }
};

export const deleteConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const configuration = await ProgramsConfig.findByPk(id);
  if (configuration) {
    await configuration.destroy();
    reply.status(204).send();
  } else {
    reply.status(200).send({ message: "Configuration Not Found" });
  }
};

export const getProgramConfigurations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { program_id } = request.params as { program_id: string };
  const { config_model, parent_config_id, title } = request.query as {
    config_model?: string;
    parent_config_id?: string;
    title?: string;
  };

  const queryConditions: any = { program_id };

  if (title) {
    queryConditions.title = {
      [Op.like]: `%${title}%`
    };
  }

  if (config_model) {
    queryConditions.config_model = config_model;
  }

  if (parent_config_id) {
    queryConditions.parent_config_id = parent_config_id;
  } else {
    queryConditions.parent_config_id = {
      [Op.or]: [null, ""],
    };
  }

  try {
    const configurations = await ProgramsConfig.findAll({
      where: queryConditions,
    });

    if (configurations.length === 0) {
      return reply.status(200).send({ message: "Configuration Not Found", programsConfigs: [] });
    }

    reply.status(200).send({
      statusCode: 200,
      message: "Program configurations retrieved successfully",
      configuration: configurations,
    });
  } catch (error) {
    console.error('Error fetching program configurations:', error);
    reply.status(500).send({
      statusCode: 500,
      message: 'Internal Server Error',
      error: error,
    });
  }
};
