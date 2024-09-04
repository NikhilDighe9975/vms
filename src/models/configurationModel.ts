import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { Programs } from "./programsModel";

class Configuration extends Model { }

Configuration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    config_model: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    data_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    value_source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source_params: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_requried: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_validations_requried: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    parent_config_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_parent_value_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    parent_value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ui_component_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    created_on: {
      type: DataTypes.DOUBLE,
    },
    modified_by: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    modified_on: {
      type: DataTypes.DOUBLE,
    },
    sr_Number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    help_icon: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    help_icon_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    child_config: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "configuration",
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

export default Configuration;
