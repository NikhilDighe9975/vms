import { FastifyInstance } from "fastify";
import {
  saveProgram,
  getAllProgram,
  getProgramById,
  updateProgramById,
  deleteProgramById,
  advancedFilter,
} from "../controllers/programsController";


async function programsRoutes(fastify: FastifyInstance) {
  fastify.post("/", saveProgram);
  fastify.get("/get-all", getAllProgram);
  fastify.get("/getbyid/:id", getProgramById);
  fastify.put("/:id", updateProgramById);
  fastify.delete("/:id", deleteProgramById);
  fastify.get("/advanced-filters", advancedFilter);
}
export default programsRoutes;
