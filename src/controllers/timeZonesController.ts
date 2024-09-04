import { FastifyRequest, FastifyReply } from 'fastify';
import TimeZone from '../models/timeZoneModel';
import hierarchies from '../models/hierarchiesModel';

export const getAllTimeZones = async (request: FastifyRequest, reply: FastifyReply) => {
  const timeZones = await TimeZone.findAll();
  if (timeZones.length === 0) {
    return reply.status(200).send({ message: "TimeZones not found", timeZones: [] });
  }
  reply.send(timeZones);
};

export const getTimeZoneById = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const timeZone = await TimeZone.findByPk(id);
  if (timeZone) {
    reply.send(timeZone);
  } else {
    reply.status(200).send({ message: 'Time zone not found', timeZone: [] });
  }
};

export const createTimeZone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { code, name, offset, utc_offset, region, num } = request.body as {
    code: string;
    name: string;
    offset: number;
    utc_offset: string;
    region: string;
    num: string;
  };

  try {
    const newTimeZone = await TimeZone.create({
      code,
      name,
      offset,
      utc_offset, 
      region,
      num
    });
    reply.status(201).send(newTimeZone);
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateTimeZone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const { code, name, offset, utcOffset, region, num } = request.body as {
    code?: string;
    name?: string;
    offset?: number;
    utcOffset?: string;
    region?: string;
    num?: string;
  };

  const timeZone = await TimeZone.findByPk(id);
  if (timeZone) {
    await timeZone.update({
      code,
      name,
      offset,
      utcOffset,
      region,
      num
    });
    reply.send(timeZone);
  } else {
    reply.status(200).send({ message: 'Time zone not found' });
  }
};

export const deleteTimeZone = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = request.params as { id: string };
  const timeZone = await TimeZone.findByPk(id);
  if (timeZone) {
    await timeZone.destroy();
    reply.status(204).send();
  } else {
    reply.status(200).send({ message: 'Time zone not found' });
  }
};