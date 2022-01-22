var seeder = require('mongoose-seed');
var mongoose = require('mongoose');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/staycation', function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/User'
  ]);

  // Clear specified collections
  seeder.clearModels([ 'User'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
  {
    'model': 'User',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903345'),
        name: 'admin',
        password: 'rahasia',
        role: 'admin'
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc903346'),
        name: 'superadmin',
        password: 'rahasia',
        role: 'superadmin'
      },
    ]
  }
];