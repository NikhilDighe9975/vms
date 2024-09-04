interface qualificationType {
  id: string;
  name: string;
  code: string;
  description: string;
  is_enabled: boolean;
  is_deleted:boolean;
  created_on:number;
  modified_on:number;
  created_by:string | null;
  modified_by:string |null;
  program_id: string;
  page?: string;
  limit?: string;
}

export default qualificationType;