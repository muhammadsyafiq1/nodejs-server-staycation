var seeder = require('mongoose-seed');
var mongoose = require('mongoose');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://localhost:27017/staycation', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}, function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/Booking',
  ]);

  // Clear specified collections
  seeder.clearModels([ 'Booking'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
    // start booking
    {
      'model': 'Booking',
      'documents': [
        {
          _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cee1'),
          bookingStartDate: '12-12-2020',
          bookingEndDate: '12-12-2020',
          invoice: 1231231,
          itemId: {
            _id: mongoose.Types.ObjectId('5e96cbe292b97300fc902222'),
            title: 'Village Angga',
            price: 6,
            duration: 2,
          },
          total: 12,
          memberId: mongoose.Types.ObjectId('5e96cbe292b97300fc903333'),
          bankId: mongoose.Types.ObjectId('5e96cbe292b97300fc903323'),
          payments: {
            proofPayment: 'images/bukti.jpg',
            bankFrom: 'BCA',
            status: 'Proses',
            accountHolder: 'ang'
          }
        }
      ]
    },
    // end booking
];