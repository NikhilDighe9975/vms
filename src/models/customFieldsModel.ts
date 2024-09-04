import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import picklistModel from './picklistModel';
import { Programs } from '../models/programsModel';
import { Module } from './moduleModel';


class customField extends Model {
  id: any;
}

customField.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id',
      },
    },
    field_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    is_all_work_location: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_all_hierarchy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    supporting_text: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_readonly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_linked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DOUBLE,
    },
    modified_on: {
      type: DataTypes.DOUBLE,
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references:
      {
        model: 'module',
        key: 'id',
      },
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    can_view: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:false
    },
    can_edit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue:false
    },
  },
  {
    sequelize,
    tableName: 'custom_fields',
    timestamps: false,
    hooks: {
      beforeValidate: convertEmptyStringsToNull,
      beforeSave: beforeSave,
    },
  }
);

customField.belongsTo(Programs, { foreignKey: 'program_id', as: 'program' });
customField.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });


export default customField;
