const { render } = require("ejs")
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const { Op } = require('sequelize');
exports.index = function(req,res){

     res.render('website/index', { activeRoute: 'website_index' });
     
}


exports.about = function(req,res){
     res.render('website/about',{activeRoute:'website_about'})
}
exports.vehicles = function(req,res){
     res.render('website/vehicles',{activeRoute:'website_vehicles'})
}
exports.rent = function(req,res){
     res.render('website/rent',{activeRoute:'website_rent'})
}
exports.startReservation = function(req,res){
     res.render('website/start_Reservation',{activeRoute:'website_startReservation'})
}
exports.policy = function(req,res){
     res.render('website/policy',{activeRoute:'website_policy'})
} 
exports.collection = function(req,res){
     res.render('website/collection',{activeRoute:'website_collection'})
}
exports.viewModify = function(req,res){
     res.render('website/viewModify',{activeRoute:'website_viewModify'})
}
exports.extendRental = function(req,res){
     res.render('website/extendRental',{activeRoute:'website_extendRental'})
}
exports.rentacar = function(req,res){
     res.render('website/rentacar',{activeRoute:'website_rentacar'})
}

exports.services = function(req,res){
     res.render('website/services',{activeRoute:'website_services'})
}

exports.pricing = function(req,res){
     res.render('website/pricing',{activeRoute:'website_pricing'})
}

exports.cars = function(req,res){
     res.render('website/cars',{activeRoute:'website_cars'})
}

exports.contact = function(req,res){
     res.render('website/contact',{activeRoute:'website_contact'})
}

exports.car_single = function(req,res){
     res.render('website/car_single',{activeRoute:'website_car_single'})
}

exports.car_reservation = function(req,res){
     res.render('website/car_reservation',{activeRoute:'website_reservation'})
}

exports.login = function(req,res){
     res.render('website/login',{activeRoute:'login',token:''})
}

exports.register = async function(req,res){

     const roles = await Role.findAll(
          {
           where: {
               role_name: {
                 [Op.notIn]: ['Admin', 'Admins', 'admin', 'admins']
               }
             }
          }
       );
  
     message = req.flash('message');
     res.render('website/register',{activeRoute:'register',message:message,roles:roles})
}

exports.verify_email = function(req,res){
     res.render('website/verify_email',{activeRoute:'verify_email'})
}

exports.reset_password = function(req,res){
     res.render('website/reset_password',{activeRoute:'reset_password'})
}