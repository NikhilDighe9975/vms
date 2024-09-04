import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { beforeSave } from "../hooks/timeFormatHook";
import { programVendor } from "./programVendorModel";
import hierarchies from "./hierarchiesModel";

class VendorHierarchyMapping extends Model { }

VendorHierarchyMapping.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        program_vendor_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "program_vendors",
                key: "id",
            },
        },
        hierarchy_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        hierarchy_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        program_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "programs",
                key: "id",
            },
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
        tableName: "vendor_hierarchy_mapping",
        timestamps: false
    }
);

sequelize.sync();
VendorHierarchyMapping.belongsTo(Programs, {
    foreignKey: "program_id",
    as: "programs",
});

VendorHierarchyMapping.belongsTo(programVendor, {
    foreignKey: "program_vendor_id",
    as: "program_vendor",
});


export default VendorHierarchyMapping;
