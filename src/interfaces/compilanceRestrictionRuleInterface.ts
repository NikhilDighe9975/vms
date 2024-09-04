
export interface CompilanceRestrictionRuleData {
  id?: string;
  name?: string;
  start_date?: Date,
  end_date?: Date,
  time_month?: number,
  time_year?: number,
  //month?:number,
  days?: number,
  vendor_ids?: string[],
  program_id?:string,
  status?: object,
  is_enabled?: boolean;
  created_on?: number;
  modified_on?: number;
  created_by?: string;
  modified_by?: string;
  is_deleted?: boolean;
  ref_id?: string;
}
