import { UUID } from "crypto";
import { CharDataType, DoubleDataType } from "sequelize";
 
export interface CreateRateTypeData {
    id: string;
    name: string;
    program_id:string,
    description: string;
    bill_rate?: JSON;
    pay_rate?: JSON;
    is_enabled?: boolean;
    is_deleted?: boolean;
    created_on?: DoubleDataType;
    modified_on?: DoubleDataType;
    created_by?: CharDataType;
    modified_by?:CharDataType;
    abbreviation?:string;
    ref_order?:Int16Array;
    ot_exemption:boolean;
    type?:string;
    edit_rate_factors?:boolean;
    hide_rate_factors?:boolean;
    billable?:boolean;
    ordering?:DoubleDataType;
    associate_all_hierarchy?:boolean;
    ref_id?:UUID;
    job_template_unit_ids?:string[];
    hierarchy_unit_ids?:string[];
    associate_all_job_template?:boolean;
   
 
 
}