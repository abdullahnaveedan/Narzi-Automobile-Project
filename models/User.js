const { DataTypes } = require('sequelize');
const { sequelize } = require('../db_config/settings');
const Role = require('./Role');  // Import the Role model

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  status: DataTypes.INTEGER,
}, {
  tableName: 'users',
  timestamps: false
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;
