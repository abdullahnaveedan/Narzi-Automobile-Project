const { DataTypes } = require('sequelize');
const { sequelize } = require('../db_config/settings');

const Brand = sequelize.define('Brand', {
    brand_name: DataTypes.STRING,
}, {
  tableName: 'brands',
  timestamps: false
});

module.exports = Brand;
