const Role = require('../models/Role');

exports.index = async function(req, res) {
  try {
    const roles = await Role.findAll();
    message = req.flash('message');
    res.render('dashboard/roles/index', { activeRoute: "dashboard_roles_index", message: message, roles: roles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.create = function(req, res) {
  message = req.flash('message');
  res.render('dashboard/roles/create', { activeRoute: "dashboard_roles_create", message: message });
}

exports.store = async function(req, res) {
  try {
    const roles = {
      role_name: req.body.role_name,
    }
    await Role.create(roles);
    req.flash('message', "new role saved");
    res.redirect('/dashboard/roles/create');
  } catch (error) {
    console.error(error);
    req.flash('message', "role not saved");
    res.redirect('/dashboard/roles/create');
  }
}

exports.destroy = async function(req, res) {
  try {
    const id = req.params.id;
    await Role.destroy({ where: { id } });
    req.flash('message', 'deleted successfully');
    res.redirect("/dashboard/roles");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
