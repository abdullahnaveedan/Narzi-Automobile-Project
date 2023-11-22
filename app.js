const express = require('express')
const path = require('path')

const websiteController = require('./controllers/websiteController')
const dashboardController = require('./controllers/dashboardController')
const usersController = require('./controllers/usersController')
const customersController = require('./controllers/customersController')
const brandsController = require('./controllers/brandsController')
const vehiclesController = require('./controllers/vehicleController')
const contactController = require('./controllers/contactsController')
const feedbacksController = require('./controllers/feedbacksController')
const rolesController = require('./controllers/rolesController')
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; 
// for auth
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Role = require('./models/Role');
//

const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const flash = require('express-flash');
const app = express()


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:"your-secret-key",
  resave:true,
  saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
//


// flash session
app.use(flash());


app.set("views", path.join(__dirname,"views"))
app.set("view engine" , "ejs")

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.locals.baseUrl = req.protocol + '://' + req.get('host');
    next();
  });


// setup passport

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email: email , status:1 } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//

// Middleware to check user role
function checkUserRole(req, res, next) {
  const allowedRoles = ['Admin','admin','Admins','admins','Affiliate','affiliate','Affiliates','affiliates','Vendor','vendor','Vendors','vendors'];

  

  try {
    // Assuming the token is stored in req.session.token
    const decoded = jwt.verify(req.session.token, 'your-secret-key'); // Replace with your actual secret key

    const userRole = decoded.role_name; // Assuming role_name is the attribute in the decoded token

    if (allowedRoles.includes(userRole)) {
      return next(); // User has an allowed role, proceed to the next middleware/route handler
    } else {
      return res.redirect('/'); // User does not have an allowed role, redirect to '/'
    }
  } catch (error) {
    console.error(error);
    return res.redirect('/'); 
  }

}

// Apply the middleware to the relevant routes
app.use('/dashboard', checkUserRole);

// session middleware

function applySessionValue(req, res, next) {
  const token = req.session.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key

      req.sessionInfo = {
        role_name: decoded.role_name,
        username: decoded.user.username,
        email: decoded.user.email
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/auth-login');
  }
}

app.use('/dashboard', applySessionValue);

const applySessionInfo = function(req, res, next) {
  const { role_name, username, email } = req.sessionInfo;
  res.locals.sessionInfo = { role_name, username, email };
  next();


    if (role_name === 'vendor' || role_name === 'vendors' || role_name === 'Vendor' || role_name === 'Vendors' || role_name === 'Admin' || role_name === 'Admins' || role_name === 'admin' || role_name === 'admins') {
      app.get('/dashboard/vehicles',vehiclesController.index)
      app.get('/dashboard/vehicles/create',vehiclesController.create)
      app.post('/dashboard/vehicles/create',vehiclesController.store)
      app.post('/dashboard/vehicles/updateStatus/:id', vehiclesController.updateStatus);
      app.get('/dashboard/vehicles/destroy/:id', vehiclesController.destroy)
      
  }
  else if(role_name === 'affiliate' || role_name === 'Affiliate' || role_name === 'Affiliates' || role_name === 'affiliates' || role_name === 'Admin' || role_name === 'Admins' || role_name === 'admin' || role_name === 'admins'){
        // Vendors routes
        app.get('/dashboard/vendors',customersController.vendor_index)
  }
  else{
  return res.redirect('/dashboard');
  }

};

app.use('/dashboard',applySessionInfo);

//


// customers
function applyCustomerSessionValue(req, res, next) {
  const token = req.session.customer_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key

      req.sessionCustomerInfo = {     
        username: decoded.user.username,
        id: decoded.user.id,
        token: token
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error'); // Return a response here
    }
  } else {
    req.sessionCustomerInfo = {};
    next(); // Proceed to the next middleware or route
  }
}

const applyCustomerSessionInfo = function(req, res, next) {
  const { username, id, token } = req.sessionCustomerInfo || {}; // Destructure with default values in case req.sessionCustomerInfo is undefined
  res.locals.sessionCustomerInfo = { username, id, token };
  next();
};


// function checkUserRole(req, res, next) {
//   const role_name = req.sessionInfo.role_name;
//   if (role_name === 'vendor' || role_name === 'vendors' || role_name === 'Vendor' || role_name === 'Vendors' || role_name === 'Admin' || role_name === 'Admins' || role_name === 'admin' || role_name === 'admins') {
//       app.get('/dashboard/vehicles',vehiclesController.index)
//       app.get('/dashboard/vehicles/create',vehiclesController.create)
//   }
//   else if(role_name === 'affiliate' || role_name === 'Affiliate' || role_name === 'Affiliates' || role_name === 'affiliates' || role_name === 'Admin' || role_name === 'Admins' || role_name === 'admin' || role_name === 'admins'){
//         // Vendors routes
//         app.get('/dashboard/vendors',customersController.vendor_index)
//   }
//   return res.redirect('/dashboard');

// }

// app.use('/dashboard', checkUserRole);




//website routes
app.get('/', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.index);
app.get('/about', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.about);
app.get('/services', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.services);
app.get('/pricing', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.pricing);
app.get('/cars', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.cars);
app.get('/contact', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.contact);
app.get('/car-single', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.car_single);
app.get('/car-reservation', applyCustomerSessionValue, applyCustomerSessionInfo, websiteController.car_reservation);
app.get('/auth-login',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.login)
app.get('/buy_car',applyCustomerSessionValue, applyCustomerSessionInfo,vehiclesController.buy_create)
app.get('/sell_car',applyCustomerSessionValue, applyCustomerSessionInfo,vehiclesController.sell_create)
app.get('/startReservation',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.startReservation)
app.get('/rentacar',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.rentacar)
app.get('/collection',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.collection)
app.get('/viewModify',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.viewModify)
app.get('/extendRental',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.extendRental)
app.get('/policy',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.policy);
app.get('/vehicles',applyCustomerSessionValue, applyCustomerSessionInfo,websiteController.vehicles);

// Authentication route
app.post('/auth-login-post', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/auth-login');
    }
    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      // Assuming 'role_id' is the attribute in your User model
      const role_id = user.role_id;

      if (role_id) {
        const role = await Role.findByPk(role_id);

        if (role && role.role_name) {
          const allowedRoles = ['Admin','admin','Admins','admins','Affiliate','affiliate','Affiliates','affiliates','Vendor','vendor','Vendors','vendors']; 
         
          req.flash('success', 'Login Successfull');

       

          if (allowedRoles.includes(role.role_name)) {
            const token = jwt.sign({ user: user,role_name: role.role_name }, secretKey, { expiresIn: '1h' });
            // Store the token in cookie or response headers
            res.cookie('token', token);
            req.session.token = token;
           
            return res.redirect('/dashboard');
          }
          else{
            const customer_token = jwt.sign({ user: user,role_name: role.role_name }, secretKey, { expiresIn: '1h' });
            // Store the token in cookie or response headers
            res.cookie('customer_token', customer_token);
            req.session.customer_token = customer_token;
            return res.redirect('/');
          }
        }
      }

     
    });
  })(req, res, next);
});




app.get('/auth-register',applyCustomerSessionInfo,websiteController.register)
app.get('/auth-verify',applyCustomerSessionInfo,websiteController.verify_email)
app.get('/auth-reset',applyCustomerSessionInfo,websiteController.reset_password)

// dashboard routes
app.get('/dashboard',dashboardController.index)
app.get('/dashboard/profile',dashboardController.profile)

//roles routes
app.get('/dashboard/roles',rolesController.index)
app.get('/dashboard/roles/create',rolesController.create)
app.post('/dashboard/roles/store',rolesController.store)
app.get('/dashboard/roles/destroy/:id',rolesController.destroy)

//users routes
app.get('/dashboard/users',usersController.index)
app.get('/dashboard/users/create',usersController.create)
app.post('/dashboard/users/store',usersController.store)
app.get('/dashboard/users/destroy/:id',usersController.destroy)
app.get('/logout',usersController.logout)

// Customers routes
app.get('/dashboard/customers',customersController.index)
app.post('/website/customers/store',customersController.store)
app.get('/dashboard/customers/destroy/:id',customersController.destroy)
app.post('/dashboard/customers/updateStatus/:id', customersController.updateStatus);

// Vendors routes
app.get('/dashboard/vendors',customersController.vendor_index)

// Affiliates routes
app.get('/dashboard/affiliates',customersController.affiliate_index)

// Brands routes
app.get('/dashboard/brands',brandsController.index)
app.get('/dashboard/brands/create',brandsController.create)
app.post('/dashboard/brands/store',brandsController.store)
app.get('/dashboard/brands/destroy/:id',brandsController.destroy)

// Vehicles routes
// app.get('/dashboard/vehicles',vehiclesController.index)
// app.get('/dashboard/vehicles/create',vehiclesController.create)



// Contact routes
app.get('/dashboard/contacts',contactController.index)
app.get('/dashboard/contacts/compose',contactController.compose)
app.get('/dashboard/contacts/view',contactController.view)

// Feedbacks routes
app.get('/dashboard/feedbacks',feedbacksController.index)




app.listen(3000,function(){
    console.log("Listening port no 3000")
})