var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.connect('localhost:27017/csc309', {
  user: '',
  pass: ''
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to MongoDB');
});


var userSchema = new Schema({
  username:  String,
  password: String,
  orders: [{truck: String, order: [{quantity: Number, food: String, price: Number}], date: Date, total:Number, number: Number}],
  facebook: {
    id: String,
  },
  truck:{name: String, 
    address: String, 
    hours: String, 
    phone: Number, 
    rating: Number, 
    type_of_food: String,
    comments: [{user: String, body: String, date: Date }],
     rating:[{rate: Number}],
  menu: [{ price: Number, food: String }],
map:String}
});



userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
  if(!this.password){
    return false;
  }

  return bcrypt.compareSync(password, this.password);
}



var User = mongoose.model('User', userSchema);



  //console.log(result.length + 'TYPE!!!!!');
 // console.log(findFood(keyword));
  //console.log(food_result + 'FOod!!!!!');
  //res.render('search.html',{user: req.user, trucks: []});



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
function turnTruckstoHtmlList(trucklist){
    //console.log(trucklist.length);
    var result = [];
    for(i=0;i<trucklist.length;i++){
       result.push(trucklist[i]);
    }
    return result;
  }
  
  User.findOne({username: "admin@fastline.com"},function(err, user) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      if(!user){
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
      }else{
        console.log('Admin already created in db!');
        return;
      }
  });


module.exports = User;