import { Model } from 'sequelize';
import ProgramModule from '../models/programModuleModel';
import { Module } from '../models/moduleModel';
import hierarchies from '../models/hierarchiesModel';
import generateSlug from '../plugins/slugGenerate';

export const createProgramModule = async (record: Model) => {
    // Create a record in the program_module table
    let modules = await Module.findAll({
        where: {
            is_deleted: false,
            parent_module_id: null
        },
    });
    let module = modules.map((module: any) => ({
        module_id: module?.id,
        is_enabled: module?.is_enabled,
    }));
    await ProgramModule.create({
        program_id: (record as any).id,
        modules: module,
    });
};

// Create a hierarchy for the program
export const createHierarchy = async (record: Model) => {
    let code = generateSlug((record as any).name, {
        trim: true,
        removedspecial: true,
    });
    let a = await hierarchies.create({
        program_id: (record as any).id,
        name: (record as any).name,
        code: code,
        hierarchy_level: 1,
        hierarchy_order: 1,
        is_enabled: true,
        rate_model: "BILL_RATE",
        preferred_date_format: "MM/DD/YYYY",
        is_vendor_neutral: false,
        is_rate_card_enforced: false,
        is_hidden: false,
    });
    console.log(a);
};
