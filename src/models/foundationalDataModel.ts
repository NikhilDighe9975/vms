import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../plugins/sequelize';
import FoundationalDataTypes from './foundationalDatatypesModel';
import { Programs } from './programsModel';
import { convertEmptyStringsToNull } from '../hooks/convertEmptyStringsToNull';
import { beforeSave } from '../hooks/timeFormatHook';

class foundationalData extends Model {
    id: any;
    foundational_data_type_id: any;
}

foundationalData.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_on: {
        type: DataTypes.DOUBLE,
        defaultValue: Date.now(),
        allowNull: false,
    },
    modified_on: {
        type: DataTypes.DOUBLE,
        defaultValue: Date.now(),
        allowNull: false,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    modified_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    foundational_data_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'foundational_datatypes',
            key: 'id',
        },
    },
    program_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'programs',
            key: 'id',
        },
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    creation_source: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'foundationalData',
    hooks: {
        beforeValidate: (instance) => {
            convertEmptyStringsToNull(instance);
        },
        beforeSave: (instance) => {
            beforeSave(instance);
        },
    },
});

foundationalData.belongsTo(Programs, { foreignKey: 'program_id', as: 'programs' });
foundationalData.belongsTo(FoundationalDataTypes, { foreignKey: 'foundational_data_type_id', as: 'foundational_datatypes' });

sequelize.sync();

export default foundationalData;
