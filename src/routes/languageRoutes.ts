import { FastifyInstance } from 'fastify';
import { searchLanguage, deleteLanguage, updateLanguage, createLanguage, getLanguageById, getLanguages } from '../controllers/languageController';

async function languageRoutes(fastify: FastifyInstance) {
    fastify.post('/', createLanguage);
    fastify.get('/', getLanguages);
    fastify.get('/:id', getLanguageById);
    fastify.put('/:id', updateLanguage);
    fastify.delete('/:id', deleteLanguage);
    fastify.get('/search-languages', searchLanguage)
}
export default languageRoutes;
