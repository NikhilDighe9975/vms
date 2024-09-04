import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { Programs } from "./programsModel";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { beforeSave } from "../hooks/timeFormatHook";

class FoundationalDataTypes extends Model {
  id: any;
  name: any;
}

FoundationalDataTypes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "programs",
        key: "id",
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    configuration: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: "foundational_datatypes",
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
FoundationalDataTypes.belongsTo(Programs, {
  foreignKey: "program_id",
  as: "programs",
});

export default FoundationalDataTypes;
