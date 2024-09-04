import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import Currencies from "./currenciesModel";


class rateCardModel extends Model {
    id: any
}

rateCardModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        job_category_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        currency_id: {
            type: DataTypes.UUID,
            references: {
                model: "currencies",
                key: "id",
            },
        },
        unit_of_measure: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        min_rate: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        min_rate_rule: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        max_rate: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_rate_rule: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        program_id: {
            type: DataTypes.UUID,
            references: {
                model: "programs",
                key: "id",
            },
        },
    },
    {
        sequelize,
        tableName: "rate_card",
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

rateCardModel.belongsTo(Programs, { foreignKey: "program_id", as: "program" });
rateCardModel.belongsTo(Currencies, { foreignKey: "currency_id", as: "currency" });
export { rateCardModel };