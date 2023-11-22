const { DataTypes } = require('sequelize');
const { sequelize } = require('../db_config/settings');

const Role = sequelize.define('Role', {
  role_name: DataTypes.STRING,
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Role;
