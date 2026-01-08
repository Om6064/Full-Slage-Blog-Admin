const { name } = require("ejs");
const { default: mongoose, Types } = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    userPassword: {
        type: String,
        required: true,
        minlength: 3,
    },
    forgotPasswordOTP : {
        type : String
    },
    forgotPasswordOTPExpiry : {
        type : Date
    },
})

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;