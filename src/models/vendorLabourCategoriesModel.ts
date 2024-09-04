import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import ProgramModule from './programModuleModel';
import { Programs } from './programsModel';
import { programVendor } from "./programVendorModel";
import IndustriesModel from './industriesModel';

class vendorLabourCategoriesModel extends Model { }
vendorLabourCategoriesModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    labour_category_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    program_vendor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'program_vendors',
            key: 'id',
        },
    },
    labour_category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'industries',
            key: 'id',
        },
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'programs',
            key: 'id',
        },
    },
    created_on: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    modified_on: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    modified_by: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'vendor_labour_categories',
});
sequelize.sync();
vendorLabourCategoriesModel.belongsTo(Programs, {
    foreignKey: "program_id",
    as: "programs",
});
vendorLabourCategoriesModel.belongsTo(programVendor, {
    foreignKey: 'program_vendor_id',
    as: 'program_vendor'
});
vendorLabourCategoriesModel.belongsTo(IndustriesModel, {
    foreignKey: 'labour_category_id',
    as: 'industries'
});
export default vendorLabourCategoriesModel;
