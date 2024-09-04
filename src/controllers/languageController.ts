import { FastifyRequest, FastifyReply } from 'fastify';
import Language from '../models/languageModel';
import { LanguageData } from '../interfaces/languageInterface';
import { Op } from 'sequelize';
import { baseSearch, advanceSearch } from '../utility/baseService';
import generateCustomUUID from '../utility/genrateTraceId'

export async function getLanguages(request: FastifyRequest<{ Querystring: LanguageData }>, reply: FastifyReply) {
  const { name, code, created_on, ...query } = request.query as LanguageData;

  try {
    const languages = await Language.findAll({
      where: {
        is_deleted: false,
        ...(name ? { name: { [Op.like]: `%${name}%` } } : {}), // Use Op.like for partial match
        ...(code ? { type: { [Op.like]: `%${code}%` } } : {}), // Use Op.like for partial match
        ...(created_on ? { created_on: { [Op.gte]: new Date(created_on) } } : {}),
      },
    });
    if (languages.length === 0) {
      return reply
        .code(200)
        .send({ message: 'Languages not found', languages: [] });
    }
    reply.status(200).send({
      status_code: 200,
      items_per_page: languages.length,
      total_records: languages.length, // Total records after filtering
      trace_id: generateCustomUUID(),
      data: languages,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function getLanguageById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  try {
    const language = await Language.findByPk(id);
    if (language) {
      reply.status(200).send({
        status_code: 200,
        data: language,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Language not found', language: [] });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function createLanguage(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const language = request.body as LanguageData;

    const item: any = await Language.create({ ...language });
    reply.status(201).send({
      statusCode: 201,
      data: item,
      trace_id: generateCustomUUID(),
    });
  } catch (error) {
    reply.status(500).send({
      message: 'An error occurred while creating',
      error
    });
  }
}


export async function updateLanguage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const LanguageData = request.body as LanguageData;
  try {
    const language: Language | null = await Language.findByPk(id);
    if (language) {
      await language.update(LanguageData);
      reply.status(200).send({
        status_code: 200,
        language_id: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Language not found' });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  }
}

export async function deleteLanguage(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const [numRowsDeleted] = await Language.update({
      is_deleted: true,
      modified_on: Date.now(),
    },
      { where: { id } }
    );

    if (numRowsDeleted > 0) {
      reply.status(200).send({
        statusCode: 200,
        language_id: id,
        trace_id: generateCustomUUID(),
      });
    } else {
      reply.status(200).send({ message: 'Language not found' });
    }
  } catch (error) {
    reply.status(500).send({ message: 'An error occurred while deleting', error });
  }
}

export async function searchLanguage(request: FastifyRequest, reply: FastifyReply) {
  const searchFields = ['name', 'code'];
  const responseFields = ['id', 'name'];
  return baseSearch(request, reply, Language, searchFields, responseFields);
}

