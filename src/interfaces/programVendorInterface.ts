export interface programVendorInterface {
    id: string;
    tenant_id: string;
    vendor_name: string;
    vendor_type: any;
    supl_ref_id: string;
    labor_category: string;
    work_locations: any;
    status: string;
    hierarchies: any;
    all_work_locations: boolean;
    all_hierarchy: boolean;
    vendor_group_id: string;
    com_doc_group: string;
    bussiness_structure: string;
    job_type: string;
    program_id: string;
    is_deleted: boolean;
    is_enabled: boolean;
    created_on: number;
    modified_on: number;
    created_by: string;
    modified_by: string;
}

