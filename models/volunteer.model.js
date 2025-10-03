import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Volunteer = sequelize.define('Volunteer', {
    userId: { // This field links directly to the User's ID
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: 'users', // table name
        key: 'id',
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastKnownLocation: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true,
    },
    averageResponseTime: { // Stored in seconds
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    averageResolveTime: { // Stored in seconds
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'volunteers',
    timestamps: true, // Adds createdAt and updatedAt
  });

  return Volunteer;
};