import programsRoutes from "./programsRoutes";
import configurationRoutes from "./configurationRotues";
import globalConfigRoutes from "./globalConfigRoutes";
import tenantRoutes from "./tenantRoutes";
import userMappingRoutes from "./usermappingRoutes";
import hierarchiesRoutes from "./hierarchiesRoutes";
import currenciesRoutes from "./currenciesRoutes";
import industriesRoutes from "./industriesRoute";
import userRoutes from "./userRoutes";
import timeZoneRoutes from "./timeZonesRoutes";
import countriesRoutes from "./countriesRoutes";
import programsConfigRoutes from "./programConfigRoutes";
import programModuleRoutes from "./programModuleRoutes";
import moduleRouter from "./moduleRoutes";
import qualificationTypeRouter from "./qualificationTypeRoutes";
import rateTypeRouter from "./rateTypeRoutes"
import foundationalDataTypeRoutes from "./foundationaldatatypesRoutes";
import workLocationRoutes from './workLocationRoute'
import languageRoutes from './languageRoutes'
import supportingTextRoutes from './supportingTextRoutes'
import holidayCalendarRoutes from "./holidayCalendarRoutes";
import feesConfigurationRoute from "./feesConfigRoute";
import picklistRoutes from "./picklistRoutes";
import ruleBuilderRoutes from "./ruleBuildderRoutes";
import foundationalDataRoutes from "./foundationalDataRoutes";
import WorkflowRoutes from "./workflowRoutes";
import customFieldsRoutes from "./customFieldsRoutes";
import reasoncodeRoute from "./reasoncodeRoutes";
import EventRoutes from "./eventRoutes";
import passwordPolicyRoutes from "./passwordPolicyRoutes";
import costComponentGroupRoutes from "./costComponentGroupRoutes";
import costComponentMappingRoutes from "./costComponentMappingRoutes";
import costcomponentRoute from "./costcomponentRoutes";
import vendorDistributionScheduleRoutes from "./vendorDistributionScheduleRoutes";
import vendorComplianceDocumentRoutes from "./vendorComplianceDocumentRoutes";
import customFieldsHierarchieRoutes from "./customFieldHierarchieRoutes";
import customFieldLocationRoutes from "./coustomFieldLocationRoutes";
import vendorInviteRoutes from "./vendorInviteRoutes";
import programVendorRoutes from "./programVendorRoutes";
import vendordocumentsgroup from "./vendordocumentgroupRoute";

import { FastifyInstance } from "fastify";
import rateCardRoutes from "./rateCardRoutes";
import rateTypeHierarchyRoutes from "./rateTypeHierarchyRoutes";
import rateTypeJobTemplateRoutes from "./rateTypeJobTemplateRoutes";
import compilanceRestrictionRuleRoutes from "./compilanceRestrictionRuleRoutes";
import VendorGroupRoutes from "./venodrGroupRoutes";
import vendorMarkupConfigRoutes from "./vendorMarkupConfigRoutes";
import vendorLabourCategoryRoutes from "./vendorLabourCategoriesRoutes";
import vendorWorkLocationMappingRoutes from "./vendorWorkLocationMappingRoutes";
import vendorHieararchyMappingRoutes from "./vendorHieararchyMappingRoutes";
const basePrefix = "/config/v1/api";

export default async function (app: FastifyInstance) {
  app.register(globalConfigRoutes, { prefix: `${basePrefix}/global-config` });
  app.register(programsRoutes, { prefix: `${basePrefix}/program` });
  app.register(tenantRoutes, { prefix: `${basePrefix}/tenant` });
  app.register(currenciesRoutes, { prefix: `${basePrefix}` });
  app.register(industriesRoutes, { prefix: `${basePrefix}` });
  app.register(userRoutes, { prefix: `${basePrefix}/user` });
  app.register(timeZoneRoutes, { prefix: `${basePrefix}/time-zone` });
  app.register(userMappingRoutes, { prefix: `${basePrefix}/usermapping` });
  app.register(configurationRoutes, { prefix: `${basePrefix}/configuration` });
  app.register(countriesRoutes, { prefix: `${basePrefix}/countries` });
  app.register(hierarchiesRoutes, { prefix: `${basePrefix}` });
  app.register(rateTypeRouter, { prefix: `${basePrefix}/program/:program_id/rate_type` })
  app.register(moduleRouter, { prefix: `${basePrefix}/module` });
  app.register(programModuleRoutes, { prefix: `${basePrefix}/program-module` });
  app.register(workLocationRoutes, { prefix: `${basePrefix}` });
  app.register(languageRoutes, { prefix: `${basePrefix}/language` });
  app.register(supportingTextRoutes, { prefix: `${basePrefix}` });
  app.register(holidayCalendarRoutes, { prefix: `${basePrefix}` });
  app.register(foundationalDataTypeRoutes, { prefix: `${basePrefix}` });
  app.register(picklistRoutes, { prefix: `${basePrefix}` })
  app.register(qualificationTypeRouter, { prefix: `${basePrefix}` });
  app.register(feesConfigurationRoute, { prefix: `${basePrefix}` })
  app.register(ruleBuilderRoutes, { prefix: `${basePrefix}` })
  app.register(programsConfigRoutes, { prefix: `${basePrefix}` });
  app.register(foundationalDataRoutes, { prefix: `${basePrefix}` })
  app.register(reasoncodeRoute, { prefix: `${basePrefix}` })
  app.register(customFieldsRoutes, { prefix: `${basePrefix}` })
  app.register(WorkflowRoutes, { prefix: `${basePrefix}` });
  app.register(EventRoutes, { prefix: `${basePrefix}` })
  app.register(passwordPolicyRoutes, { prefix: `${basePrefix}` })
  app.register(costComponentGroupRoutes, { prefix: `${basePrefix}` })
  app.register(costComponentMappingRoutes, { prefix: `${basePrefix}` })
  // app.register(supportingTextEventRoutes, { prefix: `${basePrefix}` })
  app.register(costcomponentRoute, { prefix: `${basePrefix}` })
  app.register(vendorDistributionScheduleRoutes, { prefix: `${basePrefix}` })
  app.register(compilanceRestrictionRuleRoutes, { prefix: `${basePrefix}` })
  app.register(vendorComplianceDocumentRoutes, { prefix: `${basePrefix}` })
  app.register(customFieldsHierarchieRoutes, { prefix: `${basePrefix}` })
  app.register(customFieldLocationRoutes, { prefix: `${basePrefix}` })
  app.register(vendorInviteRoutes, { prefix: `${basePrefix}` })
  app.register(rateCardRoutes, { prefix: `${basePrefix}` })
  app.register(rateTypeHierarchyRoutes, { prefix: `${basePrefix}` })
  app.register(rateTypeJobTemplateRoutes, { prefix: `${basePrefix}` })
  app.register(programVendorRoutes, { prefix: `${basePrefix}` })
  app.register(vendordocumentsgroup, { prefix: `${basePrefix}` })
  app.register(VendorGroupRoutes, { prefix: `${basePrefix}` })
  app.register(vendorMarkupConfigRoutes, { prefix: `${basePrefix}` })
  app.register(vendorLabourCategoryRoutes, { prefix: `${basePrefix}` })
  app.register(vendorWorkLocationMappingRoutes, { prefix: `${basePrefix}` })
  app.register(vendorHieararchyMappingRoutes, { prefix: `${basePrefix}` })
}