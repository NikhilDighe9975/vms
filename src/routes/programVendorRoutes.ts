import { FastifyInstance } from "fastify";
import {
    getProgramVendors,
    getProgramVendorById,
    updateProgramVendor,
    deleteProgramVendor,
    saveProgramVendor
} from "../controllers/programVendorController";

export default async function programVendorRoutes(fastify: FastifyInstance) {
    fastify.get('/program/:program_id/program_vendors', getProgramVendors);
    fastify.get('/program/:program_id/program_vendor/:id', getProgramVendorById);
    fastify.put('/program/:program_id/program_vendor/:id', updateProgramVendor);
    fastify.delete('/program/:program_id/program_vendor/:id', deleteProgramVendor);
    fastify.post('/program/:program_id/program_vendor/', saveProgramVendor);
}


