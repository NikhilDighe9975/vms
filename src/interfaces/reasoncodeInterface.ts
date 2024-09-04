export interface ReasonCode {
    program_id: string;
    id: string;
    name: string;
    source: string;
    entity_ref:string;
    category:'NEUTRAL' | 'NEGATIVE' | 'POSITIVE';
    created_on: number;
    modified_on: number;
    modified_by:JSON;
    created_by: JSON;
    is_enabled: boolean;
    module_id: string;
    event_id: string;
    is_editable: boolean;
    reason_code_limit: number;
    reason:JSON;
}

export interface ReasonCodeResponse {
    total_records: number;
    items_per_page: number;
    reason_codes: ReasonCode[];
    modified_on: number;
    trace_id: string;
}
