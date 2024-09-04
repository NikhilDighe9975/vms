export interface picklist_item_data {
    id: string;
    label: string;
    parent_id: string;
    defined_by: string;
    value: string;
    is_enabled: boolean;
    is_deleted: boolean;
    created_on: number;
    modified_on: number;
    created_by: string;
    modified_by: string;
    picklist_id: string;
    program_id: string;
    disabled_program: any;
    label_program: any;
}

export interface picklistItemUpdateData {
    label?: string;
    defined_by?: string;
    value?: string;
    is_enabled?: boolean;
    is_deleted?: boolean;
    modified_on?: number;
    modified_by?: string;
    program_id?: string;
    disabled_program?: any;
    label_program?: any;
    picklist_id?: string;
    created_by?: string;
    created_on?: number
  }
  
  export interface picklistItemQueryParams {
    label?: string;
    defined_by?: string;
    is_enabled?: boolean;
    is_deleted?: boolean;
    picklist_id?: string;
    program_id?: string;
  }