import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';
import { Programs } from "./programsModel";
class vendorComplianceDocumentModel extends Model {
  id: any;
}
vendorComplianceDocumentModel.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  act: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  document_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  upload_document_days: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  regain_compliance_days: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  work_locations: {
    type: DataTypes.JSON,
    allowNull: true
  },
  hierarchies: {
    type: DataTypes.JSON,
    allowNull: true
  },
    attached_doc_url: {
    type: DataTypes.STRING
  },
  is_required_for_onboarding: {
    type: DataTypes.BOOLEAN
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
  },

  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false
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
    modelName: 'vendor_compliance_document',
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
vendorComplianceDocumentModel.belongsTo(Programs, { foreignKey: 'program_id', as: 'programs' });
export default vendorComplianceDocumentModel;
