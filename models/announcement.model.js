import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Announcement = sequelize.define('Announcement', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        scheduledFor: {
            type: DataTypes.DATE,
            allowNull: true, // Null if sent immediately
        },
    }, {
        tableName: 'announcements',
        timestamps: true,
    });
    return Announcement;
};