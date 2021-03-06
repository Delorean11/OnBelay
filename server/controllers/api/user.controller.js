var User = require('../../models').User;

exports.findActiveClimbers = function(req, res) {
  var authUser = req.decoded.user;

  User.find({climb: true}, function(err, climbers) {
    if (err) console.error(err);
    var result = climbers.map(function(climber) {

      if (climber.username === authUser) return;

      return {
        username: climber.username,
        first: climber.name.first,
        last: climber.name.last,
        zipCode: climber.zipCode,
        gender: climber.gender,
        skillLevel: climber.skillLevel,
        id: climber._id,
        favs: climber.favs || '',
        profileImg: climber.profileImg || 'assets/img/profile-generic.jpg'
      };
    });
    res.json(result);
  });
};

exports.getClimberInfo = function(req, res){
  console.log('in getClimberInfo');
  User.findOne({username: req.params.username}, function(err, climber){
    if(err) console.log(err);

    var info = {
      username: climber.username,
      name: climber.name,
      zipCode: climber.zipCode,
      gender: climber.gender,
      skillLevel: climber.skillLevel,
      id: climber._id,
      favs: climber.favs || '',
      profileImg: climber.profileImg || 'assets/img/profile-generic.jpg'
    };
    res.json(info);
  });
};

// module.exports = {
//   findActiveClimbers: function(req, res) {
//     var authUser = req.decoded.user;

//     User.find({climb: true}, function(err, climbers) {
//       if (err) console.error(err);
//       var result = climbers.map(function(climber) {

//         if (climber.username === authUser) return;

//         return {
//           username: climber.username,
//           first: climber.name.first,
//           last: climber.name.last,
//           zipCode: climber.zipCode,
//           gender: climber.gender,
//           skillLevel: climber.skillLevel,
//           id: climber._id
//         };
//       });
//       res.json(result);
//     });
//   }
// };
