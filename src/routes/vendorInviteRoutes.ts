import { FastifyInstance } from "fastify";
import {
    getVendorInvite,
    advanceSearchInvite,
    getVendorInviteById,
    createVendorInvite,
    updateVendorInvite,
    deleteVendorInvite
} from "../controllers/vendorInviteController"

async function vendorInviteRoutes(fastify: FastifyInstance) {
    fastify.get('/program/:program_id/vendor-invite', getVendorInvite);
    fastify.post('/program/:program_id/vendor-invite/advance-search', advanceSearchInvite);
    fastify.get('/program/:program_id/vendor-invite/:id', getVendorInviteById);
    fastify.post('/program/:program_id/vendor-invite', createVendorInvite);
    fastify.put('/program/:program_id/vendor-invite/:id', updateVendorInvite);
    fastify.delete('/program/:program_id/vendor-invite/:id', deleteVendorInvite);
}

export default vendorInviteRoutes;
