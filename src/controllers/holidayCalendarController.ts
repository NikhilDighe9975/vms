import { FastifyRequest, FastifyReply } from "fastify";
import holidayCalendar from "../models/holidayCalendarModel";
import { holidayCalendarData } from "../interfaces/holidayCalendarInterface";
import generateCustomUUID from "../utility/genrateTraceId";
import { Op } from "sequelize";


export async function getHolidayCalendar(
    request: FastifyRequest<{ Params: { program_id: string }, Querystring: { name?: string, year?: number, is_enabled?: boolean } }>,
    reply: FastifyReply
) {
    try {
        const { program_id } = request.params;
        const { name, year, is_enabled } = request.query;

        const filters: any = { program_id };

        if (name) {
            filters.name = { [Op.like]: `%${name}%` };
        }

        if (year) {
            filters.year = year;
        }

        if (is_enabled !== undefined) {
            filters.is_enabled = is_enabled;
        }

        const holiday_calendars = await holidayCalendar.findAll({
            where: filters,
            attributes: ['id', 'name', 'year', 'is_enabled', 'modified_on']
        });

        if (holiday_calendars.length > 0) {
            reply.status(200).send({
                status_code: 200,
                message: 'HolidayCalendars fetched successfully.',
                trace_id: generateCustomUUID(),
                holiday_calendars
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'No HolidayCalendars found.',
                holiday_calendars: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching HolidayCalendars.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export async function getHolidayCalendarById(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const holiday_calendar = await holidayCalendar.findOne({ where: { program_id, id } });
        if (holiday_calendar) {
            reply.status(200).send({
                status_code: 200,
                message: 'HolidayCalendar fetch Successfully.',
                trace_id: generateCustomUUID(),
                holiday_calendar: holiday_calendar
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'HolidayCalendar not found.',
                holidayCalendar: []
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while fetching HolidayCalendar.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}

export const createHolidayCalendar = async (request: FastifyRequest, reply: FastifyReply) => {
    const holiday_calendar = request.body as holidayCalendarData;
    if (!holiday_calendar.is_all_hierarchies && (!holiday_calendar.hierarchy_units_ids || holiday_calendar.hierarchy_units_ids.length === 0)) {
        return reply.status(400).send({
            status_code: 400,
            trace_id: generateCustomUUID(),
            message: 'hierarchy_units is required when is_all_hierarchies is false.',
        });
    }

    if (!holiday_calendar.is_all_work_locations && (!holiday_calendar.work_locations_ids || holiday_calendar.work_locations_ids.length === 0)) {
        return reply.status(400).send({
            status_code: 400,
            trace_id: generateCustomUUID(),
            message: 'work_locations is required when is_all_work_locations is false.',
        });
    }

    try {
        await holidayCalendar.create({ ...holiday_calendar });
        reply.status(201).send({
            status_code: 201,
            trace_id: generateCustomUUID(),
            message: 'HolidayCalendar Created Successfully.',
        });
    } catch (error) {
        reply.status(500).send({
            status_code: 500,
            message: 'An error occurred while creating HolidayCalendar.',
            trace_id: generateCustomUUID(),
            error: (error as Error).message,
        });
    }
};

export const updateHolidayCalendar = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    const { id } = request.params;
    try {
        const [updatedCount] = await holidayCalendar.update(request.body as holidayCalendarData, { where: { id } });
        if (updatedCount > 0) {
            reply.send({
                status_code: 201,
                message: 'HolidayCalendar updated successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(200).send({
                status_code: 200,
                message: 'HolidayCalendar not found.',
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'Internal Server error',
            trace_id: generateCustomUUID(),
            error
        });
    }
};

export async function deleteHolidayCalendar(
    request: FastifyRequest<{ Params: { program_id: string, id: string } }>,
    reply: FastifyReply
) {
    try {
        const { program_id, id } = request.params;
        const holidayCalendarData = await holidayCalendar.findOne({ where: { program_id, id } });
        if (holidayCalendarData) {
            await holidayCalendar.update({ is_deleted: true, is_enabled: false }, { where: { program_id, id } });
            reply.status(204).send({
                status_code: 204,
                message: 'HolidayCalendar deleted successfully.',
                trace_id: generateCustomUUID(),
            });
        } else {
            reply.status(404).send({
                status_code: 404,
                message: 'HolidayCalendar not found.'
            });
        }
    } catch (error) {
        reply.status(500).send({
            message: 'An error occurred while deleting HolidayCalendar.',
            trace_id: generateCustomUUID(),
            error: error,
        });
    }
}