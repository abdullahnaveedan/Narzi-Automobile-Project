const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Vehicle = require('../models/Vehicle');

exports.index = async function(req, res) {
  try {
    const users = await User.findAll({
      include: [{ 
        model: Role, attributes: ['role_name'] ,
        where: {
            role_name: {
              [Op.notIn]: ['Customer', 'Customers', 'customer', 'customers', 'Vendor', 'Vendors', 'vendor', 'vendors', 'Affiliate', 'Affiliates', 'affiliate', 'affiliates']
            }
          }
    }],
    });
    message = req.flash('message');
    res.render('dashboard/users/index', { activeRoute: "dashboard_users_index", users: users, message: message });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.create = async function(req, res) {
  try {
    const roles = await Role.findAll(
       {
        where: {
            role_name: {
              [Op.notIn]: ['Customer', 'Customers', 'customer', 'customers']
            }
          }
       }
    );
    message = req.flash('message');
    res.render('dashboard/users/create', { activeRoute: "dashboard_users_create", message: message, roles: roles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.store = async function(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = {
      username: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role_id: req.body.role_id,
      status:1
    }
    await User.create(users);
    req.flash('message', "data saved");
    res.redirect('/dashboard/users/create');
  } catch (error) {
    console.error(error);
    req.flash('message', "data not saved");
    res.redirect('/dashboard/users/create');
  }
}

exports.destroy = async function(req, res) {
  try {
    const id = req.params.id;
    await User.destroy({ where: { id } });
    req.flash('message', 'deleted successfully');
    res.redirect("/dashboard/users");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


// Assuming you're using express-session for session management
exports.logout = function(req, res) {
  // Clear the session
  req.session.destroy((err) => {
      if(err) {
          console.error(err);
      } else {
          // Clear the JWT token (if stored in cookies)
          res.clearCookie('token');
          res.redirect('/auth-login'); // Redirect to login page after logout
      }
  });
}
