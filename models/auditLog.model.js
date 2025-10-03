import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        targetEntity: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        targetId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    }, {
        tableName: 'audit_logs',
        timestamps: true,
        updatedAt: false, // No need for updatedAt in a log
    });
    return AuditLog;
};