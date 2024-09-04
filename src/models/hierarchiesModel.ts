import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import { Programs } from './programsModel';
import { beforeSave } from '../hooks/timeFormatHook';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import generateSlug from '../plugins/slugGenerate';

class hierarchies extends Model {
  parent_hierarchy_id: any;
  name: any;
}
hierarchies.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parent_hierarchy_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parent_hierarchy_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ref_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    foundational_data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    preferred_currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferred_language: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    program_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferred_date_format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_rate_card_enforced: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_vendor_neutral: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    managers: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    rate_model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addresses: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    contact_info: {
      type: DataTypes.JSON,
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
    },
    modified_by: {
      type: DataTypes.UUID,
    },
    hierarchies: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    time_zones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pick_list_items: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    custom_fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'hierarchies',
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
// hierarchies.belongsTo(Programs, { foreignKey: 'program_id' });

export default hierarchies;
