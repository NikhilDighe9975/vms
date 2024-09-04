import { FastifyRequest, FastifyReply } from "fastify";
import Configuration from "../models/configurationModel";
import { ConfigurationAttributes } from "../interfaces/configurationInterface";
import generateCustomUUID from "../utility/genrateTraceId";

export const getConfigurations = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const configurations = await Configuration.findAll({order: [["sr_Number", "ASC"]]});
    if (configurations.length === 0) {
      return reply.status(200).send({
        status_code: 200,
        message: "Configuration data not found",
        configurations: [],
        trace_id: generateCustomUUID(),
      });
    }
    reply.status(200).send({
      status_code: 200,
      message: "Data fetch successfully",
      configurations: configurations,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Failed to fetch configurations",
      trace_id: generateCustomUUID(),
    });
  }
};

export const getConfigurationById = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = request.params as { id: string };
  const configuration = await Configuration.findByPk(id);
  if (configuration) {
    reply.status(200).send({
      status_code: 200,
      message: "Data fetch successfully",
      configurations: configuration,
      trace_id: generateCustomUUID(),
    });
  } else {
    reply.status(200).send({
      status_code: 200,
      message: "Configuration data not found",
      configuration: [],
      trace_id: generateCustomUUID(),
    });
  }
};

export const createConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const configData = request.body as Partial<ConfigurationAttributes>;
    const newConfiguration: any = await Configuration.create(configData);
    reply.status(201).send({
      status_code: 201,
      message: "Configuration data created successfully",
      configuration: newConfiguration?.id,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Failed to create configuration",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export const updateConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const configData = request.body as Partial<ConfigurationAttributes>;
    const configuration: any = await Configuration.findByPk(id);
    if (configuration) {
      await configuration.update(configData);
      reply.status(201).send({
        status_code: 201,
        message: "Configuration data update successfully",
        configuration: configuration?.id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: "Configuration not found",
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Failed to update configuration",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};

export const deleteConfiguration = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params as { id: string };
    const configuration = await Configuration.findByPk(id);
    if (configuration) {
      await configuration.update({
        is_deleted: true,
        is_enabled: false,
      });
      reply.status(204).send({
        status_code: 204,
        message: "Configuration data deleted successfully",
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        message: "Configuration not found",
        trace_id: generateCustomUUID(),
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      message: "Failed to delete configuration",
      trace_id: generateCustomUUID(),
      error: error,
    });
  }
};
