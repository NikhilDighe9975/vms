interface vendorMarkupConfigInterface {
    id: string;
    tenant_id?: string;
    program_id: string;
    rate_nodel?: string;
    sliding_scale?: boolean;
    markup_config?: any;  
    sourced_markup?: number;
    payrolled_markup?: number;
    labor_category?: string;
    hierarchy?: any;  
    work_locations?: any; 
    is_default?: boolean;
    is_enabled: boolean;
    is_deleted: boolean;
    created_on:string;
  }
  export default vendorMarkupConfigInterface;
  