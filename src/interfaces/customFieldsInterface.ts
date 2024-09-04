export interface customFields {
  id: string;
  program_id: string;
  type: string;
  name: string;
  label: string;
  slug: string;
  placeholder: string;
  meta_data: object;
  is_all_work_location: boolean;
  is_all_hierarchy: boolean;
  supporting_text: string;
  description: string | null;
  is_required: boolean;
  is_readonly: boolean;
  is_enabled: boolean;
  modified_on: Date;
  created_by: string;
}