export interface hierarchiesData {
  id: string;
  parent_hierarchy_id: string;
  parent_hierarchy_name: string;
  name: string;
  is_enabled: boolean;
  foundational_data: any[];
  preferred_currency: string;
  preferred_language: string;
  program_type: string;
  preferred_date_format: string;
  is_rate_card_enforced: boolean;
  is_vendor_neutral: boolean;
  managers: any[];
  rate_model: string;
  addresses: any[];
  contact_info: Record<string, any>;
  created_by: string;
  created_on: number;
  modified_by: string;
  modified_on: number;
  defaults: any[];
  time_zones: any;
  pick_list_items: any;
  is_hidden: boolean;
  code: string;
  custom_fields: Record<string, any>;
}
