import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { beforeSave } from '../hooks/timeFormatHook';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
class Language extends Model { }

Language.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_on: {
    type: DataTypes.DOUBLE,
  },
  modified_on: {
    type: DataTypes.DOUBLE,
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize,
  tableName: 'language',
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
export default Language;
