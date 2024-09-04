import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { Programs } from './programsModel';
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';

class User extends Model {
  id: any;
  
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'programs',
        key: 'id',
      },
    },
    name_prefix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
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
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name_suffix: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    sso_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supervisor_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    themes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    country_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DOUBLE,
    },
    modified_on: {
      type: DataTypes.DOUBLE,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user',
    timestamps: false,
    hooks: {
      beforeValidate: (instance) => {
        convertEmptyStringsToNull(instance);
      },
      beforeSave: (instance) => {
        beforeSave(instance);
      },
    },
    indexes: [
      {
        unique: true,
        fields: ['id', 'program_id']
      }
    ],
  }
);

sequelize.sync();

User.belongsTo(Programs, { foreignKey: "program_id", as: "programs" });

export default User;
