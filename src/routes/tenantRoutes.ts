import { FastifyInstance } from "fastify";
import { TenantData } from "../interfaces/tenantInterface";
import {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  searchTenantsWithProgramCount,
  advancedSearchTenants,
  getPasswordPolicy
} from "../controllers/tenantController";

async function tenantRoutes(fastify: FastifyInstance) {
  fastify.get("/", getTenants);
  fastify.get("/:id", getTenantById);
  fastify.post("/", async (request, reply) => createTenant(request.body as TenantData, reply));
  fastify.put("/:id", updateTenant);
  fastify.delete("/:id", deleteTenant);
  fastify.get("/search-tenant", searchTenantsWithProgramCount);
  fastify.post("/advanced-filter", advancedSearchTenants);
  fastify.get("/:client_id/password-policy", getPasswordPolicy);
}

export default tenantRoutes;
