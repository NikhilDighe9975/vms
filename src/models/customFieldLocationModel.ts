import { DataTypes, Model } from "sequelize";
import { sequelize } from "../plugins/sequelize";
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';
import customField from "./customFieldsModel";
import WorkLocationModel from "./workLocationModel";
import { Programs } from '../models/programsModel';
class CustomFieldLocation extends Model { }
CustomFieldLocation.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    custom_field_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    work_location_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
},
{
    sequelize,
    modelName: 'customFieldLocation',
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
export default CustomFieldLocation;
