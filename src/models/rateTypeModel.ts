import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
 
 
class rateType extends Model { }
 
rateType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bill_rate: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    pay_rate: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DOUBLE,
      defaultValue: false,
    },
    modified_on: {
      type: DataTypes.DOUBLE,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ref_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ot_exemption: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    edit_rate_factors: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hide_rate_factors: {
      type: DataTypes.BOOLEAN,
    },
    billable: {
      type: DataTypes.BOOLEAN,
    },
    ordering: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    associate_all_hierarchy: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hierarchy_unit_ids:{
      type:DataTypes.JSON,
      allowNull:true
    },
    ref_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    associate_all_job_template: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    job_template_unit_ids:{
      type:DataTypes.JSON,
      allowNull:true
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
    tableName: "rate_type",
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
 
rateType.belongsTo(Programs, { foreignKey: "program_id", as: "program" });
export { rateType };