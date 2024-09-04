import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import customField from './customFieldsModel';
import  hierarchies  from './hierarchiesModel';
import {Programs} from './programsModel';

class customFieldHierarchie extends Model { }

customFieldHierarchie.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    custom_field_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    hierarchy_id: {
        type: DataTypes.UUID,
        allowNull: true
    }
},
  {
    sequelize,
    tableName: 'custom_fields_hierarchie',
    timestamps: false,
    hooks: {
      beforeValidate: convertEmptyStringsToNull,
      beforeSave: beforeSave,
    },
  }
);

export default customFieldHierarchie;
