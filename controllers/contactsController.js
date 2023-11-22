

exports.index = (req,res)=>{

    res.render('dashboard/contacts/index',{activeRoute:'dashboard_contacts_index'})

}

exports.compose = (req,res)=>{

    res.render('dashboard/contacts/compose',{activeRoute:'dashboard_contacts_compose'})

}

exports.view = (req,res)=>{

    res.render('dashboard/contacts/view',{activeRoute:'dashboard_contacts_view'})

}