import { Json } from 'sequelize/types/utils';

export interface ProgramConfigAttributes {
  id: string;
  config_model: string;
  title: string;
  description: string;
  key: string;
  data_type: string;
  value: Json;
  value_source: string;
  source_url: string;
  source_params: Json;
  is_requried: boolean;
  is_validations_requried: boolean;
  groupId: string;
  program_id: string;
  index: number;
  parent_config_id?: string;
  is_parent_value_required: boolean;
  parent_value: boolean;
  ui_component_type: string;
  created_by: string;
  created_on: number;
  modified_by: string;
  modified_on: number;
  sr_Number: number;
  options: Json;
  is_default: boolean;
  child_config: Json
}
