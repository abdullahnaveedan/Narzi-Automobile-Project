const User = require('../models/User');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const Role = require('../models/Role');
exports.index = async(req, res) => {

    try {
        const users = await User.findAll({
          include: [{ 
            model: Role, attributes: ['role_name'] ,
            where: {
                role_name: {
                  [Op.in]: ['Customer', 'Customers', 'customer', 'customers']
                }
              }
        }],
        });
        message = req.flash('message');
        res.render('dashboard/customers/index', { activeRoute: 'dashboard_customers_index', message: message,users:users });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }


}

exports.vendor_index = async function(req, res) {
  try {
    const users = await User.findAll({
      include: [{ 
        model: Role, attributes: ['role_name'] ,
        where: {
            role_name: {
              [Op.in]: ['Vendor', 'Vendors', 'vendor', 'vendors']
            }
          }
    }],
    });
    message = req.flash('message');
    res.render('dashboard/vendors/index', { activeRoute: 'dashboard_vendors_index', message: message,users:users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.affiliate_index = async function(req, res) {
  try {
    const users = await User.findAll({
      include: [{ 
        model: Role, attributes: ['role_name'] ,
        where: {
            role_name: {
              [Op.in]: ['Affiliate', 'Affiliates', 'affiliate', 'affiliates']
            }
          }
    }],
    });
    message = req.flash('message');
    res.render('dashboard/affiliates/index', { activeRoute: 'dashboard_affiliates_index', message: message,users:users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.store = async function(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = {
      username: req.body.username,
      email: req.body.email,
      role_id: req.body.role_id, 
      password: hashedPassword,
      status:1
    }
    await User.create(users);
    req.flash('message', "data saved");
    res.redirect('/auth-register');
  } catch (error) {
    console.error(error);
    req.flash('message', "data not saved");
    res.redirect('/auth-register');
  }
}


exports.destroy = async function(req, res) {
    try {
      const id = req.params.id;
      await User.destroy({ where: { id } });
      req.flash('message', 'deleted successfully');
      res.redirect("/dashboard/customers");
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  

  exports.updateStatus = async function(req, res) {
    const userId = req.params.id;
    const newStatus = req.body.status;

    try {
        const user = await User.findByPk(userId);
        if (user) {
            user.status = newStatus;
            await user.save();
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error updating status' });
    }
}
