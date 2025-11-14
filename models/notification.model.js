import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // --- ADD THESE EXPLICIT FOREIGN KEY DEFINITIONS ---
    userId: {
      type: DataTypes.UUID,
      allowNull: false, // A notification must belong to a user
      references: {
        model: 'users', // table name
        key: 'id',
      }
    },
    incidentId: {
      type: DataTypes.UUID,
      allowNull: true, // A notification CAN belong to an incident, but it's optional
      references: {
        model: 'incidents', // table name
        key: 'id',
      }
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  return Notification;
};