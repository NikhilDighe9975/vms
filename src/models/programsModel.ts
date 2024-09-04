
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import Tenant from "./tenantModel";
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { createProgramModule, createHierarchy } from "../hooks/afterProgramSave";
import generateSlug from "../plugins/slugGenerate";

class Programs extends Model {
  unique_id: any;
}

Programs.init(
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
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    industries: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tenant",
        key: "id",
      },
    },
    msp_id: {
      type: DataTypes.UUID,
      references: {
        model: "tenant",
        key: "id",
      },
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    start_date: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
      type: DataTypes.UUID,
      allowNull: true,
    },
    decoration: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "programs",
    timestamps: false,
    hooks: {
      beforeValidate: (instance) => {
        convertEmptyStringsToNull(instance);
      },
      beforeSave: (instance) => {
        beforeSave(instance);

      },
      afterSave: (instance) => {
        createProgramModule(instance);
        createHierarchy(instance);
      },
    },
  }
);

sequelize.sync();

Programs.belongsTo(Tenant, { foreignKey: "client_id", as: "client" });
Programs.belongsTo(Tenant, { foreignKey: "msp_id", as: "msp" });

export { Programs };