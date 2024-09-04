import { FastifyInstance } from 'fastify';
import {
saveCustomFieldsHierarchie,
  getCustomFieldById,
  updateCustomFieldById,
  deleteCustomField,
  searchCustomFields
} from '../controllers/customFieldHierarchieController';

async function customFieldsHierarchieRoutes(fastify: FastifyInstance) {
  fastify.post('/custom-fields-hierarchie', saveCustomFieldsHierarchie);
  fastify.get('/program/:program_id/custom-fields-hierarchie/:id', getCustomFieldById);
  fastify.put('/program/:program_id/custom-fields-hierarchie/:id', updateCustomFieldById);
  fastify.delete('/program/:program_id/custom-fields-hierarchie/:id', deleteCustomField);
  fastify.get('/program/:program_id/custom-fields-hierarchies', searchCustomFields);
}

export default customFieldsHierarchieRoutes;