import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import {Module} from "./moduleModel";
import {Programs} from './programsModel';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';

class Event extends Model {
  id: any;
}

Event.init(
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_on:{
       type:DataTypes.DATE,
       defaultValue:DataTypes.NOW
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Module,
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
  },
  {
    sequelize,
    tableName: 'event',
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

Event.belongsTo(Module, {foreignKey: "module_id",as: "module"});
Event.belongsTo(Programs, {foreignKey: "program_id",as: "program"});

export default Event;
