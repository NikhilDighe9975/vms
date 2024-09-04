import WorkLocationModel from "../models/workLocationModel";
import { WorkLocationInterface } from "../interfaces/workLocationInterface";
import { FastifyRequest, FastifyReply } from "fastify";
import generateCustomUUID from "../utility/genrateTraceId";
import TimeZone from "../models/timeZoneModel";
import Currencies from "../models/currenciesModel";
import CountryModel from "../models/countriesModel";

export async function createWorkLocation(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const workLocation = request.body as WorkLocationInterface;
  try {
    const workLocationData: any = await WorkLocationModel.create({
      ...workLocation,
    });
    return reply.status(201).send({
      status_code: 201,
      message: "Work Location Created Successfully",
      workLocation: workLocationData.id,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Failed To Create Work Location", error
    });
  }
}

export async function getAllWorkLocations(
  request: FastifyRequest<{ Querystring: WorkLocationInterface }>,
  reply: FastifyReply
) {
  try {
    const params = request.params as WorkLocationInterface;
    const query = request.query as WorkLocationInterface | any;

    const page = parseInt(query.page ?? "1");
    const limit = parseInt(query.limit ?? "10");
    const offset = (page - 1) * limit;
    delete query.page;
    delete query.limit;

    if (query.is_enabled) {
      query.is_enabled = query.is_enabled === "false" ? false : true;
    }

    let order: [string, string][] = [["modified_on", "DESC"]];
    if (query.sort === "1") {
      order = [["modified_on", "ASC"]];
    } else if (query.sort === "-1") {
      order = [["modified_on", "DESC"]];
    }

    const workLocations = await WorkLocationModel.findAll({
      where: { ...query, program_id: params.program_id, is_deleted: false },
      limit,
      offset,
      order,
      include: [
        {
          model: TimeZone,
          as: 'time_zones',
          attributes: ['id', 'name'],
        },
        {
          model: CountryModel,
          as: 'countries',
          attributes: ['id', 'name'],
        }
      ]
    });

    for (const location of workLocations) {
      const currencyIds = location.currency_id as string[] || [];
      if (currencyIds.length > 0) {
        const currencies = await Currencies.findAll({
          where: { id: currencyIds },
          attributes: ['id', 'name']
        });
        location.dataValues.currencies = currencies;
      } else {
        location.dataValues.currencies = [];
      }
    }

    const count = await WorkLocationModel.count({
      where: { ...query, program_id: params.program_id, is_deleted: false },
    });

    return reply.status(200).send({
      status_code: 200,
      items_per_page: limit,
      total_records: count,
      work_locations: workLocations,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error,
    });
  }
}

export async function getWorkLocationById(
  request: FastifyRequest<{ Params: { id: string; program_id: string } }>,
  reply: FastifyReply
) {
  const { id, program_id } = request.params;

  if (!id || !program_id) {
    return reply.status(400).send({
      status_code: 400,
      trace_id: generateCustomUUID(),
      message: "Invalid parameters",
    });
  }
  try {
    const workLocation = await WorkLocationModel.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      },
      include: [
        {
          model: TimeZone,
          as: 'time_zones',
          attributes: ['id', 'name'],
        },
        {
          model: CountryModel,
          as: 'countries',
          attributes: ['id', 'name'],
        },
      ]
    });

    if (!workLocation) {
      return reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: "Work Location Not Found",
      });
    }

    const currencyIds = workLocation.currency_id as string[] || [];
    if (currencyIds.length > 0) {
      const currencies = await Currencies.findAll({
        where: { id: currencyIds },
        attributes: ['id', 'name']
      });
      workLocation.dataValues.currencies = currencies;
    } else {
      workLocation.dataValues.currencies = [];
    }

    return reply.status(200).send({
      status_code: 200,
      work_location: workLocation,
      trace_id: generateCustomUUID(),
    });

  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Failed To Retrieve Work Location",
      error,
    });
  }
}

export async function updateWorkLocation(
  request: FastifyRequest<{
    Params: { id: string };
    Body: WorkLocationInterface;
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const { program_id, ...updates } = request.body;

    if (!program_id) {
      return reply.status(400).send({
        status_code: 400,
        trace_id: generateCustomUUID(),
        message: "program_id is required in the request body"
      });
    }

    const [numRowsUpdated] = await WorkLocationModel.update(
      { ...updates, modified_on: Date.now() },
      { where: { id, program_id, is_deleted: false } }
    );

    if (numRowsUpdated > 0) {
      reply.status(200).send({
        status_code: 200,
        work_location_id: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: "Work Location Not Found"
      });
    }
  } catch (error) {
    console.error("Error Updating Work Location:", error);
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error
    });
  }
}

export async function deleteWorkLocationById(
  request: FastifyRequest<{ Params: { id: string; program_id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id, program_id } = request.params;
    const [numRowsDeleted] = await WorkLocationModel.update(
      {
        is_deleted: true,
        is_enabled: false,
        modified_on: Date.now(),
      },
      { where: { id, program_id, is_deleted: false } }
    );

    if (numRowsDeleted > 0) {
      reply.status(200).send({
        status_code: 200,
        work_location_id: id,
        trace_id: generateCustomUUID(),
        message: "Work Location Deleted Successfully",
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        message: "Work Location Not Found"
      });
    }
  } catch (error) {
    console.error("Error Deleting Work Location:", error);
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error
    });
  }
}
