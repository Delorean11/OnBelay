var User = require('../../models').User
// var random = require('mongoose-random');


exports.returnUserLocations = function(req,res) {
  var userZipcode = req.body.userZipcode;
  var queryAmount = req.body.queryAmount || 5;

  console.log(userZipcode);
  console.log(queryAmount);


  User.find({ zipCode: userZipcode }).
    limit(queryAmount).
      exec(function(err,user){
        if (err) return handleError(err);
        //We already get an array of users so there is no reason to make a new array
        // This is a test funciton, in the future if they don't have a last known location then
        // geocode their zipcode.

        //User is an array of all the matching users;
        
        if (user.length < queryAmount) {
          // just get all the users limit 20 
          console.log('we did not  reach the limit')
          User.find().limit(queryAmount).exec(function(err,user){
            if (err) return handleError(err);
            console.log(user)
            user.forEach(function(oneUser){
              if (!oneUser.lat) {
                oneUser.lat = 38.6424614;
                oneUser.lng = -90.26354332999999;
              }
            });

            res.send(user);
          })
        } else {
        
        user.forEach(function(oneUser){
          if (!oneUser.lat) {
            oneUser.lat = 38.6424614;
            oneUser.lng = -90.26354332999999;
          }
        });

      user.map(function(climber){
        return {  
          username: climber.username,
          first: climber.name.first,
          last: climber.name.last,
          zipCode: climber.zipCode,
          gender: climber.gender,
          skillLevel: climber.skillLevel,
          climb: climber.climb,
          id: climber._id,
          favs: climber.favs || '',
          profileImg: climber.profileImg || 'assets/img/profile-generic.jpg'
        }
      })
          
        res.send(user);
      }
      });



// In the future may want to make a random feature in order to keep on getting users randomly until we fill the query amount.

  // if (userArrayToReturn.length < queryAmount) {
  //   while(userArrayToReturn.length < queryAmount) {
  //     // keep on finding one until

  //   }
  // }



  // go through all users filter out those whose zipcodes don't match
  // then we want to check lenght if length != query amount then get more users
  // Once we have these users return them to client in an array.


  // return a list of users array with an object with a lat/lng and a
}

