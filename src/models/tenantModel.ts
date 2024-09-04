
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { beforeSave } from '../hooks/timeFormatHook';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
 import { Programs } from './programsModel';


class Tenant extends Model {
  password_policy: any;
}

Tenant.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  tenant_parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    //unique: true,
  },
  type: {
    type: DataTypes.ENUM('client', 'msp', 'vendor'),
    allowNull: true,
  },
  display_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  addresses: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  contacts: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  password_policy: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  primary_contact: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  secondary_contact: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_on: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  modified_on: {
    type: DataTypes.DOUBLE,
    allowNull: true,
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
    allowNull: false,
    defaultValue: false,
  },
  ref_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'tenant',
  timestamps: false, // Disable createdAt and updatedAt fields
  hooks: {
    beforeValidate: (instance) => {
      convertEmptyStringsToNull(instance);
    },
    beforeSave: (instance) => {
      beforeSave(instance);
    },
  },
});
// Export the model
export default Tenant;

