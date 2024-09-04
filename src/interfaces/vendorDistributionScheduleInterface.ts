export interface vendorDistributionSchedule {
    id: string;
    program_id: string;
    name: string;
    description: string;
    is_enabled: boolean;
    is_deleted: boolean;
    schedules: any;
    created_on: Date,
    modified_on: Date,
    created_by: string,
    modified_by: string,
}
