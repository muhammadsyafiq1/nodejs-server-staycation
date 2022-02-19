const Item = require('../models/Item')
const Booking = require('../models/Booking')
const Treasure = require('../models/Activity')

module.exports = {
    landingPage : async (req, res) => {
        try{
            const mostPicked = await Item.find()
                .select('_id title country price unit imageId')
                .limit(5)
                .populate({ path: 'imageId', select:'_id imageUrl' })

                const traveler = await Booking.find()
                const treasure = await Treasure.find()
                const city = await Item.find()

            res.status(200).json({ 
                hero : {
                    travelers: traveler.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                mostPicked
             })
        }catch(error){

        }
    }
}