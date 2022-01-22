const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    role: {
        type: String,
    },

    password: {
        type: String,
        required: true,
    }
});

// generate password
usersSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
})


module.exports = mongoose.model('User', usersSchema);