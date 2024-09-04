import fastify from "fastify";
import pino from "pino";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { sequelize, checkDatabaseConnection } from "./plugins/sequelize";

dotenv.config();
// import {
//   countriesRoutes,
//   configurationRoutes,
//   userMappingRoutes,
//   globalConfigRoutes,
//   tenantRoutes,
//   hierarchiesRoutes,
//   programsRoutes,
//   currenciesRoutes,
//   industriesRoutes,
//   userRoutes,
//   timeZoneRoutes,
//   programModuleRoutes,
//   moduleRouter,
//   foundationalDataTypeRoutes,
//   workLocationRoutes,
//   ruleBuilderRoutes,
//   languageRoutes,
//   supportingTextRoutes,
//   qualificationTypeRouter,
//   holidayCalendarRoutes,
//   feesConfigurationRoute,
//   picklistRoutes,
//   foundationalDataRoutes,
//   programsConfigRoutes,
//   reasoncodeRoute,
//   customFieldsRoutes
//   // feesConfigurationRoute,
// } from "./routes";
// import generateSlug from "./plugins/slugGenerate";
import registerRoutes from "./routes";
const app = fastify({
  logger: pino({ level: "info" }),
});
dotenv.config();
app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
app.get("/", async (request, reply) => {
  reply.send({ message: "Welcome to the config service" });
});

app.register(registerRoutes);

let port = Number(process.env.PORT) || 3000;
const start = async () => {
  try {
    const dbStatus = await checkDatabaseConnection();
    if (!dbStatus.connected) {
      throw new Error(dbStatus.message);
    }

    await app.listen({ port: port, host: "0.0.0.0" }, (err) => {
      if (err) throw err;
    });

    app.log.info(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
