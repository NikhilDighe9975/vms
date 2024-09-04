import { FastifyInstance } from 'fastify';
import {
  createCountry,
  bulkUploadCountry,
  getCountries,
  getCountriesById,
  updateCountry,
  deleteCountry
} from '../controllers/countriesControllers';

export default async function countriesRoutes(fastify: FastifyInstance) {
  fastify.post('/',createCountry);
  fastify.post('/bulk-upload',bulkUploadCountry);
  fastify.get('/get-all', getCountries)
  fastify.get('/:id', getCountriesById);
  fastify.put('/:id', updateCountry);
  fastify.delete('/:id', deleteCountry);
}
