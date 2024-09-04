import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import Tenant from "./tenantModel";
import { Programs } from './programsModel';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';

class vendorMarkupConfig extends Model { }

vendorMarkupConfig.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: Tenant,
                key: 'id',
            },
        },
        program_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Programs,
                key: 'id',
            },
        },
        rate_nodel: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sliding_scale: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        markup_config: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        sourced_markup: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        payrolled_markup: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        labor_category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hierarchy: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        work_locations: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        created_on: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    },
    {
        sequelize,
        tableName: 'vendor_markup_config',
        timestamps: false,
        hooks: {
            beforeValidate: (instance) => {
                convertEmptyStringsToNull(instance);
            },
            beforeSave: (instance) => {
                beforeSave(instance);
            },
        },
    }
);

vendorMarkupConfig.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });
vendorMarkupConfig.belongsTo(Programs, { foreignKey: "program_id", as: "programs" });

export default vendorMarkupConfig;
