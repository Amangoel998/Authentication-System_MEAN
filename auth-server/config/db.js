const mongoose = require("mongoose");

const config = require("config");
const dbURI = config.get("mongoURI");

const User = require("../models/User");

const bcrypt = require("bcryptjs");


const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("MongoDB Connected....");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const createUser = async (newuser) => {
    let msg = "";
    let user = await User.findOne(
        { user_email: newuser.user_email },
        (err, user) => {
            if (err) msg = err.message;
            if (user) msg = "User Already Exists";
        }
    );
    if (msg) {
        const payload = {
            error: msg,
        };
        return payload;
    }
    user = new User(newuser);
    const salt = await bcrypt.genSalt();
    user.user_password = await bcrypt.hash(newuser.user_password, salt);
    await user.save((err, res) => {
        if (err) msg = err.message;
    });
    if (msg) {
        const payload = {
            error: msg,
        };
        return payload;
    } else {
        const payload = {
            user: {
                id: user.id,
            },
        };
        return payload;
    }
};

const loginUser = async (candidate) => {
    let msg = "";
    const user = await User.findOne(
        { user_email: candidate.user_email },
        (err, user) => {
            if (err) msg = err.message;
            if (!user) msg = "Invalid Credentials";
        }
    );
    if (msg || !user) {
        const payload = {
            error: msg,
        };
        return payload;
    }
    const isMatch = await bcrypt.compare(
        candidate.user_password,
        user.user_password
    );
    if (!isMatch) {
        const payload = {
            error: "Invalid Credentials",
        };
        return payload;
    }
    const payload = {
        user: {
            id: user.id,
        },
    };
    return payload;
};
module.exports = {
    connectDB,
    createUser,
    loginUser
}