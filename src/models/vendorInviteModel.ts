import { DataTypes, Model, UUIDV4 } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";

class vendorInviteModel extends Model { }

vendorInviteModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        vendor_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.INTEGER,
            defaultValue: '1031',
            allowNull: true,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: true
        },
        modified_by: {
            type: DataTypes.UUID,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DOUBLE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        modified_on: {
            type: DataTypes.DOUBLE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        invited_on: {
            type: DataTypes.DOUBLE,
            defaultValue: DataTypes.NOW,
            allowNull: true
        },
        program_id: {
            type: DataTypes.UUID,
            references: {
                model: "programs",
                key: "id",
            },
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'vendor_invite'
    }
);

sequelize.sync()

vendorInviteModel.belongsTo(Programs, { foreignKey: 'program_id', as: 'programs' })
export default vendorInviteModel;

