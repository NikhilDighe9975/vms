import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { beforeSave } from "../hooks/timeFormatHook";

class Workflow extends Model { }

Workflow.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        flow_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hierarchies: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        placement_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        module: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        config: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        levels: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        created_on: {
            type: DataTypes.DOUBLE,
        },
        modified_on: {
            type: DataTypes.DOUBLE,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        modified_by: {
            type: DataTypes.UUID,
            allowNull: true,
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
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "workflow",
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
Workflow.belongsTo(Programs, {
    foreignKey: "program_id",
    as: "programs",
});

export default Workflow;
