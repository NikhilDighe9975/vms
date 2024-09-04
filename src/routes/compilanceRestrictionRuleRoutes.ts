import { FastifyInstance } from "fastify";
import {
  getCompilanceRestrictionRules,
  getCompilanceRuleById,
  createCompilanceRestrictionRule,
  updateRule,
  deleteRule
} from "../controllers/compilanceRestrictionRuleController";

async function compilanceRestrictionRuleRoutes(fastify: FastifyInstance) {
  fastify.get("/program/:program_id/compilance-restriction-rule/", getCompilanceRestrictionRules);
  fastify.get("/program/:program_id/compilance-restriction-rule/:id", getCompilanceRuleById);
  fastify.post("/compilance-restriction-rule/", createCompilanceRestrictionRule);
  fastify.put("/program/:program_id/compilance-restriction-rule/:id", updateRule);
  fastify.delete("/program/:program_id/compilance-restriction-rule/:id", deleteRule);
}

export default compilanceRestrictionRuleRoutes;
