
exports.index = function(req, res) {
   
 res.render('dashboard/index', { activeRoute: 'dashboard_index'});
      
}



exports.profile = (req,res)=>{
    res.render('dashboard/profile',{activeRoute:'dashboard_profile'})
}