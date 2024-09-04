import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';

class Module extends Model { }

Module.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        parent_module_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'module',
                key: "id",
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
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
        },
        modified_on: {
            type: DataTypes.DOUBLE,
        },
        ref_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },

    {
        sequelize,
        tableName: 'module',
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

sequelize.sync();

// Module.hasMany(Module, { foreignKey: 'parent_module_id', as: 'Modules' });

export { Module };
