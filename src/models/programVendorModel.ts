import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import Tenant from "./tenantModel";
import { Programs } from "./programsModel";
import IndustriesModel from "./industriesModel";

class programVendor extends Model {
    id: any;
}

programVendor.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "tenant",
                key: "id",
            }
        },
        vendor_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        vendor_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        supl_ref_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        labor_category: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "industries",
                key: "id",
            }
        },
        work_locations: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        hierarchies: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        all_work_locations: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        all_hierarchy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        vendor_group_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        com_doc_group: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bussiness_structure: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        job_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        program_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "programs",
                key: "id",
            }
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        created_on: {
            type: DataTypes.DOUBLE,
            defaultValue: Date.now(),
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modified_on: {
            type: DataTypes.DOUBLE,
            defaultValue: Date.now(),
            allowNull: true,
        },
        created_by: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: true,
        },
        modified_by: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: true,
        },

    },
    {
        sequelize,
        modelName: "program_vendors",
    }
);
sequelize.sync()
programVendor.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});

programVendor.belongsTo(Programs, {
    foreignKey: "program_id",
    as: "program",
});

programVendor.belongsTo(IndustriesModel, {
    foreignKey: "labor_category",
    as: "industries",
});


export { programVendor };
