import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { Module } from './moduleModel';
import { beforeSave } from '../hooks/timeFormatHook';
import { Programs } from './programsModel';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';

class ruleBuilderModel extends Model { }

ruleBuilderModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  rule_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rule_code: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  },
  module_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  module_code: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  module_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'module',
      key: 'id',
    },
  },
  program_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id',
    },
  },
  rule_type: {
    type: DataTypes.STRING(50),
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
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  effective_start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  effective_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  modified_on: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  created_on: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  hierarchies: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rule_event: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rule_event_id:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  placement_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  decision_table_rule_files: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  conditions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  actions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  initial_trigger_conditions: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rule_inputs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rule_outputs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  rules_json: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  file_submission_status: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rule_initial_trigger_conditions:{
    type: DataTypes.JSON,
    allowNull: true,
  },
  enable_dates:{
    type: DataTypes.DOUBLE,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'rulebuilder',
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

ruleBuilderModel.belongsTo(Module, { foreignKey: 'module_id', as: 'Module' });
ruleBuilderModel.belongsTo(Programs, { foreignKey: 'program_id', as: 'Programs' });

export default ruleBuilderModel;