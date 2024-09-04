import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { Programs } from './programsModel';

class qualificationTypeModel extends Model {
  id: any;
}

qualificationTypeModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(200),
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
  created_on: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  modified_on: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.DOUBLE,
  },
  modified_by: {
    type: DataTypes.DOUBLE,
  },
  program_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'programs',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'qualification_types',
  timestamps: false,
});

sequelize.sync();

qualificationTypeModel.belongsTo(Programs, { foreignKey: 'program_id' });

export default qualificationTypeModel;