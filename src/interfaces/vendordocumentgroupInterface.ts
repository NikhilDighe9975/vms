export interface VendorDocumentGroup {
    program_id: String;
    id: string;
    name: string;
    description: string;
    required_documents: JSON;
    created_on: number;
    modified_on: number;
    modified_by:JSON;
    created_by: JSON;
    is_enabled: boolean;
    total_documents: number;
    items_per_page: number;
    trace_id: string;
}

