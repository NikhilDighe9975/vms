import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { beforeSave } from "../hooks/timeFormatHook";
import { supportingTextAttributes } from "../interfaces/supportingTextInterface";
import { Programs } from "./programsModel";
import { Module } from "./moduleModel";
import Event from "./eventModel";

interface SupportingTextCreationAttributes
  extends Optional<supportingTextAttributes, "id"> { }

class SupportingTextModel
  extends Model<supportingTextAttributes, SupportingTextCreationAttributes>
  implements supportingTextAttributes {
  public id!: string;
  public performed_by!: string;
  public is_enabled!: boolean;
  public is_deleted!: boolean;
  public created_on?: number;
  public modified_on?: number;
  public program_id!: string;
  public event_id!: string;
  public module_id!: string;
  public created_by!: string;
  public modified_by!: string;
  public support_text_action!: { id: string; name: string; slug: string; is_enabled: boolean; support_text: { description: string; url: string; label: string; is_enabled: boolean } }[];
  supporting_text_event: any;
  module: any;
  event: any;
}

SupportingTextModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    performed_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    modified_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    program_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'programs',
        key: "id",
      },
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'event',
        key: "id",
      },
    },
    module_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'module',
        key: "id",
      },
    },
    support_text_action: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isArrayOfObjects(value: any) {
          if (!Array.isArray(value)) {
            throw new Error("support_text_action must be an array of objects");
          }
        },
      },
    },
  },
  {
    sequelize,
    modelName: "supporting_text",
    timestamps: false,
    hooks: {
      beforeSave,
    },
  }
);

SupportingTextModel.belongsTo(Programs, {
  foreignKey: "program_id",
  as: "programs",
});

SupportingTextModel.belongsTo(Module, {
  foreignKey: "module_id",
  as: "module",
});

SupportingTextModel.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

export default SupportingTextModel;
