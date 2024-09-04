export interface UserInterface {
    id: string;
    name_prefix?: string;
    first_name?: string;
    addresses?: string;
    contacts?: string;
    middle_name?: string;
    last_name?: string;
    username?: string;
    name_suffix?: string;
    email: string;
    sso_id?: string;
    program_id?: string;
    title?: string;
    avatar?: string;
    country_id?: string;
    is_enabled?: boolean;
    is_activated?: boolean;
    is_deleted?: boolean;
    created_by?: string;
    modified_by?: string;
    ref_id?: string;
}
