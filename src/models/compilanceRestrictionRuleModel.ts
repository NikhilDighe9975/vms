import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { beforeSave } from "../hooks/timeFormatHook";
import { convertEmptyStringsToNull } from "../hooks/convertEmptyStringsToNull";
import { CompilanceRestrictionRuleData } from "../interfaces/compilanceRestrictionRuleInterface";
import Tenant from "./tenantModel";
import { Programs } from "./programsModel";

interface CompilanceRestrictionRule extends Model<CompilanceRestrictionRuleData> {
  setVendors(vendors: string[]): Promise<void>
}
class CompilanceRestrictionRule extends Model<CompilanceRestrictionRuleData> implements CompilanceRestrictionRuleData {
  public id!: string;
  public name!: string;
  public start_date!: Date;
  public end_date!: Date;
  public status!: object;
  public is_enabled!: boolean;
  public created_on?: number;
  public program_id?:string;
  public modified_on?: number;
  public created_by?: string;
  public modified_by?: string;
  public is_deleted!: boolean;
  public ref_id?: string;
  public vendor_ids?: string[];
}

// Initialize the model
CompilanceRestrictionRule.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.JSON,
    allowNull: false,
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
  program_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
        model: "programs",
        key: "id",
    },
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
  vendor_ids:{
    type:DataTypes.JSON
  },
  ref_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: "compilanceRestrictionRule",
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

CompilanceRestrictionRule.belongsToMany(Tenant, {
  through: "CompilanceRestrictionRuleVendors",
  as: "vendors",
  foreignKey: "compilanceRestrictionRuleId",
  otherKey: "vendorId",
});

CompilanceRestrictionRule.belongsTo(Programs, {
  foreignKey: "program_id",
  as: "programs",
});

export default CompilanceRestrictionRule;
