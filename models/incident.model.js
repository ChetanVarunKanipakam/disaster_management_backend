import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Incident = sequelize.define('Incident', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('FIRE', 'EARTHQUAKE', 'FLOOD', 'OTHERS'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'),
      defaultValue: 'PENDING',
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'), // Using PostGIS geometry type
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
  }, {
    tableName: 'incidents',
    timestamps: true, // createdAt and updatedAt
  });

  return Incident;
};