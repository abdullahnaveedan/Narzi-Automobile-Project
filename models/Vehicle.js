const { DataTypes } = require('sequelize');
const { sequelize } = require('../db_config/settings'); // Make sure you have your sequelize instance configured

const Brand = require('./Brand'); // Assuming you have a Brand model

const Vehicle = sequelize.define('Vehicle', {
  name: DataTypes.STRING(100),
  license_plate: {
    type: DataTypes.STRING(20),
    unique: true,
  },
  vin: {
    type: DataTypes.STRING(17),
    unique: true,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  color: DataTypes.STRING(50),
  insurance_provider: DataTypes.STRING(100),
  policy_number: DataTypes.STRING(50),
  mileage: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  fuel_type: DataTypes.ENUM('petrol', 'diesel'),
  fuel_efficiency: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  seating_capacity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  transmission: DataTypes.ENUM('automatic', 'manual'),
  pickup_location: DataTypes.STRING(100),
  dropoff_location: DataTypes.STRING(100),
  contact_person: DataTypes.STRING(100),
  phone_number: DataTypes.STRING(20),
  email_address: DataTypes.STRING(100),
  additional_features: DataTypes.TEXT,
  service_history: DataTypes.TEXT,
  vehicle_type: DataTypes.ENUM('normal', 'buy', 'sell'),
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  status:DataTypes.INTEGER,
}, {
  tableName: 'vehicles',
  timestamps: false,
});

Vehicle.belongsTo(Brand, { foreignKey: 'brand_id' });

module.exports = Vehicle;
