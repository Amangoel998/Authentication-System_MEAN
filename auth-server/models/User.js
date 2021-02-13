const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    user_name: {
        type : String,
        required : true
    },
    user_email: {
        type: String,
        required: true,
        unique: true
    },
    user_password: {
        type: String,
        required: true
    },
    user_dob: {
        type: Date,
        default: Date.now
    },
    versionKey: false
},
{
  collection: 'users'
});
module.exports = User = mongoose.model('user', UserSchema);