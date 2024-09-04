import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';
import { Programs } from "./programsModel";
class FeesConfigurationModel extends Model { }
FeesConfigurationModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hierarchy_levels: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  source_model: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  vendors: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  effective_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  funding_model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  MSP_Partner_Fee: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  vms_fee: {
    type: DataTypes.JSON,
    allowNull: false,

  },
  labor_category: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  modified_by: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  ref_id: {
    type: DataTypes.UUID,
  },
  categorical_fees: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  funded_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_on: {
    type: DataTypes.DOUBLE,
  },
  modified_on: {
    type: DataTypes.DOUBLE,
  },
  program_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id',
    },
  },
},
  {
    sequelize,
    modelName: 'fees',
    timestamps: false,
    hooks: {
      beforeValidate: (instance) => {
        convertEmptyStringsToNull(instance);
      },
      beforeSave: (instance) => {
        beforeSave(instance);
      },
    },
  });

  sequelize.sync();
  FeesConfigurationModel.belongsTo(Programs, { foreignKey: 'program_id', as: 'programs' });
export default FeesConfigurationModel;
