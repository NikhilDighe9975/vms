import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { programVendor } from '../models/programVendorModel'
import IndustriesModel from "./industriesModel";

class vendorWorkLocationMapping extends Model { }

vendorWorkLocationMapping.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        program_vendor_id: {
            type: DataTypes.UUID,
            references: {
                model: "program_vendors",
                key: "id",
            },
        },
        labour_category_id: {
            type: DataTypes.UUID,
            references: {
                model: "industries",
                key: "id",
            },
        },
        program_id: {
            type: DataTypes.UUID,
            references: {
                model: "programs",
                key: "id",
            },
        },
        vendor_work_location_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        created_on: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        modified_on: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
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
        timestamps: false,
        modelName: "vendor_work_location_mappings"
    }
);

vendorWorkLocationMapping.belongsTo(Programs, { foreignKey: 'program_id', as: 'program' })
vendorWorkLocationMapping.belongsTo(programVendor, { foreignKey: 'program_vendor_id', as: 'program_vendor' })
vendorWorkLocationMapping.belongsTo(IndustriesModel, { foreignKey: 'labour_category_id', as: 'industries' })

export default vendorWorkLocationMapping;