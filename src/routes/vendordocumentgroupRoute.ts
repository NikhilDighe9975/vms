import { FastifyInstance } from 'fastify';
import { createVendordocumentsgroup,deleteVendordocumentsgroup,getVendordocumentsgroup,getVendorDocumentsGroupByIdAndDoc,getVendordocumentsgroupId,updateVendordocumentsgroup  } from '../controllers/vendordocumentgroupController';

async function reasoncodeRoute(fastify: FastifyInstance) {
    fastify.post('/vendor-documents-group', createVendordocumentsgroup);
    fastify.get('/program/:program_id/vendor-documents-group', getVendordocumentsgroup);
    fastify.get('/program/:program_id/vendor-documents-group/:id', getVendordocumentsgroupId);
    fastify.put('/program/:program_id/vendor-documents-group/:id', updateVendordocumentsgroup);
    fastify.get('/program/:program_id/vendor-group/:id', getVendorDocumentsGroupByIdAndDoc);
    fastify.delete('/program/:program_id/vendor-documents-group/:id', deleteVendordocumentsgroup);
}

export default reasoncodeRoute;