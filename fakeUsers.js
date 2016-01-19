var User = require('./server/models').User;
var mongoose = require('mongoose');
var register = require('./server/controllers/api/auth.controller');

module.exports = function() {
  var userArray = [
    {
      username: 'seanreimer',
      password: '1234',
      name: {
        first: 'Sean',
        last: 'Reimer'
      },
      zipCode: 90210,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'bryanbierce',
      password: '1234',
      name: {
        first: 'Bryan',
        last: 'Bierce'
      },
      zipCode: 90210,
      skillLevel: 'advanced',
      gender: 'male',
      climb: true
    },
    {
      username: 'santoshgautam',
      password: '1234',
      name: {
        first: 'Santosh',
        last: 'Gautam'
      },
      zipCode: 90210,
      skillLevel: 'beginner',
      gender: 'male',
      climb: true
    },
    {
      username: 'delphinef',
      password: '1234',
      name: {
        first: 'Delphine',
        last: 'Foo-Matkin'
      },
      zipCode: 90210,
      skillLevel: 'advanced',
      gender: 'female',
      climb: true
    },
    {
      username: 'scottnugent',
      password: '1234',
      name: {
        first: 'Scott',
        last: 'Nugent'
      },
      zipCode: 97408,
      skillLevel: 'beginner',
      gender: 'male',
      climb: true
    },
    {
      username: 'brettgotfried',
      password: '1234',
      name: {
        first: 'Brett',
        last: 'Gotfried'
      },
      zipCode: 97005,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'bethwalker',
      password: '1234',
      name: {
        first: 'Beth',
        last: 'Walker'
      },
      zipCode: 90210,
      skillLevel: 'advanced',
      gender: 'female',
      climb: true
    },
    {
      username: 'dougweiss',
      password: '1234',
      name: {
        first: 'Doug',
        last: 'Weiss'
      },
      zipCode: 98107,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'tiaroberts',
      password: '1234',
      name: {
        first: 'Tia',
        last: 'Roberts'
      },
      zipCode: 97214,
      skillLevel: 'beginner',
      gender: 'female',
      climb: true
    },
    {
      username: 'tylerbierce',
      password: '1234',
      name: {
        first: 'Tyler',
        last: 'Bierce'
      },
      zipCode: 92103,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'erinadewey',
      password: '1234',
      name: {
        first: 'Erin',
        last: 'Dewey'
      },
      zipCode: 92103,
      skillLevel: 'intermediate',
      gender: 'female',
      climb: true
    },
    {
      username: 'kaitlinnelson',
      password: '1234',
      name: {
        first: 'Kaitlin',
        last: 'Nelson'
      },
      zipCode: 78201,
      skillLevel: 'beginner',
      gender: 'female',
      climb: true
    },
    {
      username: 'kentu',
      password: '1234',
      name: {
        first: 'Ken',
        last: 'Tu'
      },
      zipCode: 90034,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'alyssamichaels',
      password: '1234',
      name: {
        first: 'Alyssa',
        last: 'Michaels'
      },
      zipCode: 90034,
      skillLevel: 'beginner',
      gender: 'female',
      climb: true
    },
    {
      username: 'chissmith',
      password: '1234',
      name: {
        first: 'Chris',
        last: 'Smith'
      },
      zipCode: 92093,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'dalegallion',
      password: '1234',
      name: {
        first: 'Dale',
        last: 'Gallion'
      },
      zipCode: 93730,
      skillLevel: 'beginner',
      gender: 'male',
      climb: true
    },
    {
      username: 'jeffbaer',
      password: '1234',
      name: {
        first: 'Jeff',
        last: 'Baer'
      },
      zipCode: 90210,
      skillLevel: 'beginner',
      gender: 'male',
      climb: true
    },
    {
      username: 'mikerova',
      password: '1234',
      name: {
        first: 'Mike',
        last: 'Rova'
      },
      zipCode: 97404,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'lindamullen',
      password: '1234',
      name: {
        first: 'Linda',
        last: 'Mullen'
      },
      zipCode: 97401,
      skillLevel: 'beginner',
      gender: 'female',
      climb: true
    },
    {
      username: 'joewright',
      password: '1234',
      name: {
        first: 'Joe',
        last: 'Wright'
      },
      zipCode: 90005,
      skillLevel: 'intermediate',
      gender: 'male',
      climb: true
    },
    {
      username: 'nickwalters',
      password: '1234',
      name: {
        first: 'Nick',
        last: 'Walters'
      },
      zipCode: 90210,
      skillLevel: 'beginner',
      gender: 'male',
      climb: true
    }
    // {
    //   username: '',
    //   password: '1234',
    //   name: {
    //     first: '',
    //     last: ''
    //   },
    //   zipCode: 90210,
    //   skillLevel: '',
    //   gender: '',
    //   climb: true
    // }
  ];
  userArray.forEach(function(obj) {
    User.findOne({username: obj.username}, function(err, user) {
      if (err) console.log(err);
      if(!user) {
        var newUser = new User({
          username: obj.username,
          password: null,
          name: {
            first: obj.name.first,
            last: obj.name.last
          },
          zipCode: obj.zipCode,
          skillLevel: obj.skillLevel,
          gener: obj.gender,
          climb: true
        });
        console.log('created');
        newUser.hashPassword(obj.password, function(hash) {
          newUser.password = hash;
          newUser.save(function(err, user) {
            if (err) console.error(err);
          });
        });
      }
    });
  });
};