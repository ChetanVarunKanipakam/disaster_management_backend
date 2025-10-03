import { DataTypes } from 'sequelize';
export default (sequelize) => {
    const Setting = sequelize.define('Setting', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    value: {
        type: DataTypes.JSON, // Use JSON to store complex values like arrays or objects
        allowNull: false,
    },
    }, {
        tableName: 'settings',
        timestamps: true, // Shows when a setting was last updated
    });
    return Setting;
};