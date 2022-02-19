const Item = require('../models/Item')

module.exports = {
    landingPage : async (req, res) => {
        try{
            const mostPicked = await Item.find()
                .select('_id title country price unit imageId')
                .limit(5)
                .populate({ path: 'imageId', select:'_id imageUrl' })
            res.status(200).json({ mostPicked })
        }catch(error){

        }
    }
}