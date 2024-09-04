import { FastifyRequest, FastifyReply } from 'fastify';
import Event from '../models/eventModel';
import eventInterface from '../interfaces/eventInterface';
import generateCustomUUID from '../utility/genrateTraceId';
import { baseSearch } from '../utility/baseService';

export async function getAllEvents(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['name', 'is_enabled', 'module_id', 'program_id'];
  const responseFields = ['id', 'name', 'slug', 'is_enabled', 'module_id', 'program_id'];
  return baseSearch(request, reply, Event, searchFields, responseFields)
}

export async function getEventById(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id, program_id } = request.params as { id: string, program_id: string };
    const item = await Event.findOne({
      where: {
        id,
        program_id,
        is_deleted: false,
      },
    });
    if (item) {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        event: item
      });
    } else {
      reply.status(200).send({
        status_code: 200,
        trace_id: generateCustomUUID(),
        event: [],
        message: 'Event not found.',
      });
    }
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error
    });
  }
}

export async function createEvent(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const event = request.body as eventInterface;
    const { program_id } = event;

    if (!program_id) {
      return reply.status(400).send({
        status_code: 400,
        trace_id: generateCustomUUID(),
        message: 'Program id is required.',
      });
    }

    const eventData = await Event.create({ ...event, program_id });

    reply.status(201).send({
      status_code: 201,
      trace_id: generateCustomUUID(),
      message: 'Event created successfully.',
      event: {
        id: eventData?.id,
      },
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error,
    });
  }
}


export async function updateEvent(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { id, program_id } = request.params as { id: string, program_id: string };
    const data = request.body as eventInterface;

    const eventData = await Event.findOne({
      where: { id, program_id, is_deleted: false },
    });

    if (!eventData) {
      return reply.status(200).send({
        trace_id: generateCustomUUID(),
        message: 'Event data not found.',
        event: [],
      });
    }
    await eventData.update(data);
    reply.status(201).send({
      status_code: 201,
      message: 'Event updated successfully.',
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'Internal Server Error',
      trace_id: generateCustomUUID(),
    });
  }
}

export async function deleteEvent(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id, program_id } = request.params as { id: string, program_id: string };
    const eventData = await Event.findOne({
      where: { id, program_id, is_deleted: false },
    });
    if (!eventData) {
      return reply.status(200).send({ message: 'Event data not found.' });
    }
    await eventData.update({ is_enabled: false, is_deleted: true });
    reply.status(204).send({
      status_code: 204,
      trace_id: generateCustomUUID(),
      message: 'Event Deleted Successfully.'
    });
  } catch (error) {
    reply.status(500).send({
      status_code: 500,
      trace_id: generateCustomUUID(),
      message: "Internal Server Error",
      error
    });
  }
}
