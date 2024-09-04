import { Json } from "sequelize/types/utils";

export interface vendorComplianceDocumentInterface {
  name: string;
  act?: string;
  description?: string;
  frequency: string;
  document_number: string;
  upload_document_days: number;
  regain_compliance_days: number;
  work_locations: object;
  attached_doc_url?: string;
  is_required_for_onboarding?: boolean;
  hierarchies?: Json;
  ref_id?: string;
  is_enabled: boolean;
  is_deleted: boolean;
  program_id: string;
  last_updated: Date

}
