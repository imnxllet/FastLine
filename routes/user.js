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
  menu: [{ price: Number, food: String }]}
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
  /*User.find({truck: {$exists: true}},function(err, trucks) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      console.log(trucks);
   });
  
/*console.log(new User());
var testUser = new User();
          testUser.username = 'test@test.com';
          testUser.password = testUser.generateHash('testtest');
          testUser.truck.name = 'mi';*/


/*testUser.save(function (err) {
    if (err) {
      console.log(err);
      return;
    }});

console.log('usersave!/');*/

/*User.findById(testUser._id, function(err, user) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('\n\n Found book instance: ' + user);
 });*/
 

module.exports = User;