import { FastifyInstance } from "fastify";

import {
  getConfigurations,
  getConfigurationById,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
} from "../controllers/configurationController";

async function configurationRoutes(fastify: FastifyInstance) {

  fastify.get("/", getConfigurations,);
  fastify.get("/:id", getConfigurationById,);
  fastify.post("/", createConfiguration);
  fastify.put("/:id", updateConfiguration,);
  fastify.delete("/:id", deleteConfiguration,);
}

export default configurationRoutes;
