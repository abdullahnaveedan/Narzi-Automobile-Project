const Brand = require('../models/Brand');
const Vehicle = require('../models/Vehicle');
exports.index = async (req,res)=>{
    const vehicles = await Vehicle.findAll(
        {
            include: [{ 
                model: Brand, attributes: ['brand_name'] 
            }]
        }
    );
    message = req.flash('message');
    res.render('dashboard/vehicles/index',{activeRoute:'dashboard_vehicles_index',vehicles:vehicles,message:message})
}

exports.create = async (req,res)=>{
    const brands = await Brand.findAll();
    message = req.flash('message');
    res.render('dashboard/vehicles/create',{activeRoute:'dashboard_vehicles_create',message:message,brands:brands})
}
exports.store = async function(req, res) {
    try {
      const vehicleData = {
        brand_id: req.body.brand,
        name: req.body.name,
        license_plate: req.body.license_plate,
        vin: req.body.vin,
        year: req.body.year,
        color: req.body.color,
        insurance_provider: req.body.insurance_provider,
        policy_number: req.body.policy_number,
        mileage: req.body.mileage,
        fuel_type: req.body.fuel_type,
        fuel_efficiency: req.body.fuel_efficiency,
        seating_capacity: req.body.seating_capacity,
        transmission: req.body.transmission,
        pickup_location: req.body.pickup_location,
        dropoff_location: req.body.dropoff_location,
        contact_person: req.body.contact_person,
        phone_number: req.body.phone_number,
        email_address: req.body.email_address,
        additional_features: req.body.additional_features,
        service_history: req.body.service_history,
      };
  
      await Vehicle.create(vehicleData);
  
      req.flash('message', 'Data saved successfully');
      res.redirect('/dashboard/vehicles/create');
    } catch (error) {
      console.error(error);
      req.flash('message', 'Data not saved');
      res.redirect('/dashboard/vehicles/create');
    }
  };

exports.sell_create = (req,res)=>{
    res.render('website/sell_car',{activeRoute:'sell_car'})
}

exports.buy_create = (req,res)=>{
    res.render('website/buy_car',{activeRoute:'buy_car'})
}

exports.updateStatus = async function(req, res) {
    const id = req.params.id;
    const newStatus = req.body.status;

    try {
        const vehicle = await Vehicle.findByPk(id);
        if (vehicle) {
            vehicle.status = newStatus;
            await vehicle.save();
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Vehicle not found' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error updating status' });
    }
}
exports.destroy = async function(req, res) {
    try {
      const id = req.params.id;
      await Vehicle.destroy({ where: { id } });
      req.flash('message', 'deleted successfully');
      res.redirect("/dashboard/vehicles");
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}