export interface UserMappingAttributes {
    id: string;
    group_id: string;
    role_id: string;
    user_id: string;
    program_id: string;
    is_activated: boolean;
    is_deleted: boolean;
    created_on?: Date; 
    modified_on?: Date;
    created_by: string;
    modified_by: string;
    ref_id: string;
    tenant_id: string;
}

