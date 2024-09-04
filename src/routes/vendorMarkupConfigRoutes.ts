import { FastifyInstance } from 'fastify';
import { getAllVendorMarkupConfig, getVendorMarkupConfigById, createVendorMarkupConfig, updateVendorMarkupConfig, deleteVendorMarkupConfig } from '../controllers/vendorMarkupConfigController';

async function vendorMarkupConfigRoutes(fastify: FastifyInstance) {
    fastify.post('/program/:program_id/vendor-markup-config', createVendorMarkupConfig);
    fastify.get('/program/:program_id/vendor-markup-config/search', getAllVendorMarkupConfig);
    fastify.get('/program/:program_id/vendor-markup-config/:id', getVendorMarkupConfigById);
    fastify.put('/program/:program_id/vendor-markup-config/:id', updateVendorMarkupConfig);
    fastify.delete('/program/:program_id/vendor-markup-config/:id', deleteVendorMarkupConfig);
}
export default vendorMarkupConfigRoutes;