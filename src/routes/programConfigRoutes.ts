import { FastifyInstance } from "fastify";
import {
  getConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  getProgramConfigurations,
} from "../controllers/programConfigController";
import verifyToken from "../middlewares/verifyToken";

async function programsConfigRoutes(fastify: FastifyInstance) {
  // fastify.get("/program/:program_id/program-config", getConfigurations);
  fastify.get("/program/:program_id/program-config/:id", getConfigurationById);
  fastify.post("/program-config", createConfiguration);
  fastify.put("/program/:program_id/program-config", updateConfiguration);
  fastify.delete("/program/:program_id/program-config/:id", deleteConfiguration);
  fastify.get("/program/:program_id/program-config", getProgramConfigurations);
}

export default programsConfigRoutes;