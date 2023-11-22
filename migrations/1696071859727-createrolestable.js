'use strict'
const db = require('../db_config/settings');
module.exports.up = function (next) {
  const query = `
  CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;
db.query(query, (error, results, fields) => {
  if (error) throw error;
  next();
});
}

exports.down = function(next) {
  const query = `DROP TABLE roles`;

  db.query(query, (error, results, fields) => {
    if (error) throw error;
    next();
  });
};
