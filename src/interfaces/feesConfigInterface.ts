import { Json } from "sequelize/types/utils";

 export interface feesConfigurationInterface {
   title: string;
   program_id:string
   hierarchy_levels: Json;
    source_model: Json;
    labor_category:Json;
    vendors: Json;
    effective_date?: string;
    funding_model: string;
    status: boolean;
    MSP_Partner_Fee: Json;
    vms_fee:Json;
    ref_id?: string;
    categorical_fees:Json;
    is_enabled:boolean,
    is_deleted:boolean
  }
  