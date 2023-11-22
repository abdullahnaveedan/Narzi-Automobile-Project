const Brand = require('../models/Brand');
exports.index = async (req,res)=>{
    const brands = await Brand.findAll();
    message = req.flash('message');
    res.render('dashboard/brands/index',{activeRoute:'dashboard_brands_index',brands:brands,message:message})
}


exports.create = (req,res)=>{
    message = req.flash('message');
    res.render('dashboard/brands/create',{activeRoute:'dashboard_brands_create',message:message})
}


exports.store = async function(req, res) {
    try {
      const brands = {
        brand_name: req.body.brand_name,
      }
      await Brand.create(brands);
      req.flash('message', "new brand saved");
      res.redirect('/dashboard/brands/create');
    } catch (error) {
      console.error(error);
      req.flash('message', "brand not saved");
      res.redirect('/dashboard/brands/create');
    }
  }

  exports.destroy = async function(req, res) {
    try {
      const id = req.params.id;
      await Brand.destroy({ where: { id } });
      req.flash('message', 'deleted successfully');
      res.redirect("/dashboard/brands");
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  