import { FastifyInstance } from 'fastify';
import {
  saveCustomFields,
  getAllCustomFields,
  getCustomFieldById,
  updateCustomFieldById,
  deleteCustomField,
  searchCustomFields
} from '../controllers/customFieldsController';

async function customFieldsRoutes(fastify: FastifyInstance) {
  fastify.post('/custom-fields', saveCustomFields);
  fastify.get('/program/:program_id/custom-fields', getAllCustomFields);
  fastify.get('/program/:program_id/custom-fields/:id', getCustomFieldById);
  fastify.put('/program/:program_id/custom-fields/:id', updateCustomFieldById);
  fastify.delete('/program/:program_id/custom-fields/:id', deleteCustomField);
  fastify.get('/custom-fields/search', searchCustomFields);}

export default customFieldsRoutes;