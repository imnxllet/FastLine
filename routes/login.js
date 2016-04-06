var express = require('express');
var router = express.Router();
var User = require('../routes/User.js');
var passport = require('passport');
var session = require('express-session');
require('../config/passport.js')(passport)

router.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

/*Get home page.*/
router.get('/', isLoggedIn, function(req, res){
  res.redirect('/home');
});

/*clear database*/
router.get('/clear', isLoggedIn, function(req, res){
  User.remove({}, function(err) { 
    console.log('collection removed') 
   });
  var admin = new User();
          admin.username = 'admin@fastline.com';
          admin.password = admin.generateHash('adminfastline');
          //admin.truck.name = 'mi';


          admin.save(function (err) {
              if (err) {
                console.log(err);
                return;
              }});

          console.log('Admin save!');
  res.render('admin.html', { user: admin ,message:"Database Cleared!"});
});

/*Get Image*/
router.get('/truck.jpg', function(req, res) {
  res.sendFile('truck.jpg');
});

router.get('/white.jpg', function(req, res) {
  res.sendFile('white.jpg');
});

/*Login Button request*/
router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));

/*Sign up Button request*/
router.get('/register', function(req, res){
  res.render('register.html',{ message: req.flash('signupMessage'),message1: req.flash('signupMessage1')});
});

/*Sign up request of customer*/
router.post('/signup-customer', passport.authenticate('local-signup-customer', {
	successRedirect: '/home',
	failureRedirect: '/register',
	failureFlash: true
}));

/*Sign up request of seller*/
router.post('/signup-seller', passport.authenticate('local-signup-seller', {
	successRedirect: '/home',
	failureRedirect: '/register',
	failureFlash: true
}));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/' }));


/*Get home page*/
router.get('/home', isLoggedIn, function(req, res){
	if(req.user.username == "admin@fastline.com"){
		res.render('admin.html', { user: req.user, message: ""});
	}else if(!req.user.truck.name){
		res.render('index.html', { user: req.user });
	}else{
		res.render('seller-home.html', { user: req.user });
	}
});
 //res.send('Username '+ username+ ' password '+ password);


/*logout request*/
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

/*Profile page*/
router.get('/profile', isLoggedIn, function(req, res){
		res.render('profile.html', { user: req.user });
	});

/*history of transaction page*/
router.get('/orders', isLoggedIn, function(req, res){
	console.log(req.user.orders);
		res.render('history.html', { user: req.user });
	});

/*get edit page*/
router.get('/profile/edit', isLoggedIn, function(req, res){
	if(!req.user.truck.name){
		res.render('edit.html', { user: req.user,message: req.flash('updateMessage')});
	}else{
		res.render('update.html', { user: req.user,message: req.flash('updateMessage')});
	}
	});

/*Update request for customer*/
router.post('/update-customer', isLoggedIn, function(req, res){
	if(req.body.password.length < 6){
		req.flash('updateMessage', 'Please Enter a password with at least 6 characters!');
		res.redirect('/profile/edit');
		return;
	}
	var user_to_update = req.user;
	console.log(req.user.username);
	console.log(req.body.password);
	var password = user_to_update.generateHash(req.body.password);
	user_to_update.password = password;
	user_to_update.save(function(err){
		if(err)
			throw err;
		return;
	});
	console.log('user modified!');
	req.flash('updateMessage', 'Password updated!');
	res.redirect('/profile/edit');
});

/*Update request for seller*/
router.post('/update-seller', isLoggedIn, function(req, res){
	var user_to_update = req.user;

	console.log(req.body);
    user_to_update.truck.name = req.body.name;
    user_to_update.truck.address = req.body.address;
    user_to_update.truck.hours = req.body.hour;
    user_to_update.truck.phone = req.body.phone;
    user_to_update.truck.type_of_food = req.body.type;
	user_to_update.truck.map = req.body.map;
	user_to_update.save(function(err){
		if(err)
			throw err;
		return;
	});

	console.log('user modified!');
	req.flash('updateMessage', 'User info Updated!');
	res.redirect('/profile/edit');
});

/*Update request for seller's menu*/
router.post('/update-menu', isLoggedIn, function(req, res){
	//var user_to_update = req.user;
	//console.log(req.user);
	var menu = [];
	User.findOne({'username': req.user.username}, function(err, user_to_update) {
	    if (err) {
	      res.status(500).send(err);
	      console.log(err);
	      return;
	    }
	    if (!user_to_update) {
	      res.status(404).send('Not found.');
	      return;
	    }
		for(var param in req.body){
		//var menu = JSON.stringify(req.body[param]).split(",");
    	var menuitem = {};
    	menuitem.food = req.body[param][0];
    	menuitem.price = req.body[param][1];
    	//console.log(menuitem);
    	menu.push(menuitem);
	    }
	    console.log(menu);
	    user_to_update.truck.menu = menu;
	    user_to_update.save(function(err){
			if(err)
				throw err;
			return;
		});

	    console.log('user\'s menu updated!');
	    req.flash('updateMessage', 'Menu updated!');
	    res.redirect('/profile/edit');
	});		
});

/*Get all the sellers*/
router.get('/trucklist', isLoggedIn, function(req, res){
	//Find all books.
	User.find({'truck.name': {$exists: true}},function(err, trucks) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(trucks);
      //console.log(req.params.id);
      res.render('trucklist.html', { user: req.user, trucks: turnTruckstoHtmlList(trucks)});
   });
		
});

/*Get seller's menu*/
router.get('/menu/:name', isLoggedIn, function(req, res){
   var truckname = req.params.name;
   User.findOne({'truck.name': truckname}, function(err, truck) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!truck) {
      res.status(404).send('Not found.');
      return;
    }

    // If found, we return the info.
    //console.log(truck); 
    res.render('menu.html', { user: req.user, truck: truck, message: req.flash('Message')});
  });
});


/*Get seller's page*/
router.get('/sellerpage/:name', isLoggedIn, function(req, res){
   var truckname = req.params.name;
   User.findOne({'truck.name': truckname}, function(err, truck) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!truck) {
      res.status(404).send('Not found.');
      return;
    }

    // If found, we return the info.
    //console.log(truck); 
    res.render('sellerpage.html', { user: req.user, truck: truck, message: req.flash('Message')});
  });
});

/*Handle comment*/
router.post('/addcomment/:name', isLoggedIn, function(req, res){
    var truckname = req.params.name;
    console.log(truckname);
    if(req.body.comment){
    	User.findOne({'truck.name': truckname}, function(err, truck) {
		    if (err) {
		      res.status(500).send(err);
		      console.log(err);
		      return;
		    }
		    if (!truck) {
		      res.status(404).send('Not found.');
		      return;
		    }
            
		    var comment = {};
            if(!req.user.truck.name){
                comment = {user: req.user.username, body: req.body.comment, date: Date.now()};
            }else{
            	comment = {user: req.user.truck.name, body: req.body.comment, date: Date.now()};
            }
		    	
			
			truck.truck.comments.push(comment);
			truck.save(function(err){
				if(err)
					throw err;
				return;
			    });
				console.log(req.body.comment + ' comment added!');
				if(!req.user.truck.name){
					res.redirect('/menu/' + truckname);
				}else{
					res.redirect('/sellerpage/' + truckname);
				}
			
			});	
	}else{
		var truck_edit = req.truck;
		console.log('NO comment !!!');
		res.redirect('/menu/' + truck_edit.truck.name);
	}
	});

/*Request for order*/
router.post('/pay/:name', isLoggedIn, function(req, res){
	var orders = {};
	var truckname = req.params.name;
	orders.truck = truckname;
	orders.date = Date.now();
	orders.order = [];
	orders.total = 0;
	orders.number = 0;
	
    
    User.findOne({'truck.name': truckname}, function(err, truck) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!truck) {
      res.status(404).send('Not found.');
      return;
    }
     for(var param in req.body){
		//var menu = JSON.stringify(req.body[param]).split(",");
		if(req.body[param][0] > 0){
	    	var oneOrder = {};
	    	oneOrder.quantity = req.body[param][0];
	    	oneOrder.food = req.body[param][1];
	    	oneOrder.price = Number(req.body[param][2]);
	    	orders.order.push(oneOrder);
	    }
	}
	    console.log(orders);
        if(orders.order.length != 0){
        	console.log("There is order!!");  

			var total = 0;
			for(i=0;i<orders.order.length;i++){
				total = total + orders.order[i].price * orders.order[i].quantity;
			}
            orders.total = total;
            orders.number = truck.orders.length + 1;
            truck.orders.push(orders);
		    req.user.orders.push(orders);
            truck.save(function(err){
				if(err)
					throw err;
				return;
			});
			req.user.save(function(err){
				if(err)
					throw err;
				return;
			});
            console.log(orders);
	        console.log('Order cretaed!');
	        res.redirect('/thankyou/' + req.user.username);
	    }else{
	    	console.log("There is no order!!");
	    	req.flash('Message', 'Please choose your quantity!')
	    	res.redirect('/menu/' + truckname);
	    }    
  });
	
});


/*Get thank you page*/
router.get('/thankyou/:username', isLoggedIn, function(req, res){
	var username = req.params.username;
		User.findOne({'username': username}, function(err, user) {
	    if (err) {
	      res.status(500).send(err);
	      console.log(err);
	      return;
	    }
	    if (!user) {
	      res.status(404).send('Not found.');
	      return;
	    }
		
	    user.save(function(err){
			if(err)
				throw err;
			return;
		});
        console.log(user);
		res.render('thankyou.html', { user: user });
	});	
	
});

/*handle search request*/
router.post('/search', function(req, res){
	if(!req.body.keyword){
		//res.redirect("/home");
		return;
	}
	
	 var word = req.body.keyword.toString().toLowerCase();
	 console.log(word);
	 var types = ["chinese", "japanese", "mexican", "italian", "indian","vietnamese","korean","thai","american","turkish","other"];
	 if(types.indexOf(word) != -1){
		 User.find({'truck.type_of_food': capitalizeFirstLetter(word)},function(err, trucklist) {
		      if (err) {
		        //res.status(500).send(err);
		        console.log("error!" + err);
		        return;
		      }
		      trucklist.sort(function(f, g) {
				    return parseFloat(g.orders.length) - parseFloat(f.orders.length);
				});
		      res.render("search.html", {user: req.user, trucks: trucklist, message:""});

		   });
	 }else{


		 User.find({'truck.name': {$exists: true}},function(err, alltrucks) {
		      if (err) {
		        res.status(500).send(err);
		        console.log(err);
		        return;
		      }
                 	
		    var resulttrucks = [];
		    for(i=0; i<alltrucks.length;i++){
		      //console.log('here');
		      for(j=0; j<alltrucks[i].truck.menu.length;j++){
		        console.log(alltrucks[i].truck.menu[j].food);
		          if(alltrucks[i].truck.menu[j].food.toLowerCase().indexOf(word) != -1){
		                console.log('There\'s food match!!');
		                resulttrucks.push(alltrucks[i]);
		                break;
		          }
		      }    
		    }
		    if(resulttrucks.length == 0){
		    	 res.render("search.html", {user: req.user,trucks: resulttrucks,message: "No truck found"});
		    	}else{
		    		  resulttrucks.sort(function(f, g) {
				    return parseFloat(g.orders.length) - parseFloat(f.orders.length);
				});
		    res.render("search.html", {user: req.user,trucks: resulttrucks,message:""});}
		  });
	}	 
});

/*Find food item in db*/
function findFood(keyword){
    //var alltrucks = [];
    var resulttrucks = [];
    User.find({'truck.name': {$exists: true}},function(err, alltrucks) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(alltrucks);
      //console.log(req.params.id);
      //alltrucks = turnTruckstoHtmlList(trucks);
   
    
    //console.log(alltrucks);
    for(i=0; i<alltrucks.length;i++){
    	for(j=0; j<alltrucks[i].truck.menu.length;j++){
    		console.log(alltrucks[i].truck.menu[j].food);
    	    if(alltrucks[i].truck.menu[j].food.indexOf(keyword) != -1){
                console.log('There\'s food match!!');
                resulttrucks.push(alltrucks[i]);
                //break;
    	    }
    	}    
    }
    console.log(resulttrucks.unique());
    console.log('-------------');
    var result =[];
    result.concat(resulttrucks.unique());

    return result;
  });  
}


/*check if user log in*/
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		console.log('is logged in!');
		//res.redirect('/home');
		return next();
	}
    console.log('is not logged in!');
	res.render('login.html', { message: req.flash('loginMessage')});
}

function turnTruckstoHtmlList(trucklist){
    //console.log(trucklist.length);
    var result = [];
    for(i=0;i<trucklist.length;i++){
       result.push(trucklist[i]);
    }
    return result;
  }

/*capitalize the first letter of string (from stackoverflow
	http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript)*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

module.exports = router;

