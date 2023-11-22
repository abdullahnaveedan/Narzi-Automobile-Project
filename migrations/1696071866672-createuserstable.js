'use strict'
const db = require('../db_config/settings');
module.exports.up = function (next) {
  const query = `
  CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status INT DEFAULT(0),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
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
  const query = `DROP TABLE users`;

  db.query(query, (error, results, fields) => {
    if (error) throw error;
    next();
  });
};
