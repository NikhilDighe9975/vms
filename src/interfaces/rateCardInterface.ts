export interface RateCardInterface {
    id: string;
    job_category_title?: string;
    currency_id?: string;
    unit_of_measure?: boolean;
    min_rate?: number;
    min_rate_rule?: string;
    max_rate?: number;
    max_rate_rule?: string;
    program_id?: string;
    is_enabled?: boolean;
    is_deleted?: boolean;
    page?: string;
    limit?: string;
}
