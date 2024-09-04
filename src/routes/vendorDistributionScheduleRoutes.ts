import { FastifyInstance } from "fastify"
import { createVendorDistributionSchedule, deleteVendorDistributionSchedule, getAllVendorDistributionSchedule, getVendorDistributionScheduleById, updatevendorDistributionSchedule } from "../controllers/vendorDistributionScheduleController";
async function vendorDistributionScheduleRoutes(fastify: FastifyInstance) {
    fastify.get("/program/:program_id/vendor-distribution-schedules", getAllVendorDistributionSchedule);
    fastify.get("/program/:program_id/vendor-distribution-schedules/:id", getVendorDistributionScheduleById);
    fastify.post("/program/:program_id/vendor-distribution-schedules",createVendorDistributionSchedule );
    fastify.put("/program/:program_id/vendor-distribution-schedules/:id", updatevendorDistributionSchedule);
    fastify.delete("/program/:program_id/vendor-distribution-schedules/:id", deleteVendorDistributionSchedule);
}
export default vendorDistributionScheduleRoutes;
