const UserModel = require("../models/userModel.js");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail.js");
// Render signup page
const renderSignUpPage = (req, res) => {
    res.render("signUp");
};

// Render login page
const renderLoginPage = (req, res) => {
    res.render("login");
};

const getResetPasswordPage = (req, res) => {
    const email = req.cookies.resetEmail;
    console.log(email);


    if (!email) {
        return res.redirect("/auth/forgot-password");
    }

    res.render("resetPassword", {
        userEmail: email
    });
};

// Register new user
const registerUser = async (req, res) => {
    try {
        const { userEmail, userPassword, userName } = req.body

        const hashedPassword = await bcrypt.hash(userPassword, 10)

        console.log(hashedPassword);

        await UserModel.create({
            userName,
            userEmail,
            userPassword: hashedPassword
        })
        res.cookie("toast", "account_created", {
            httpOnly: false, // must be readable by JS
            maxAge: 5000     // 5 seconds
        });
        res.redirect("/auth")
    } catch (error) {
        res.cookie("toast", "register_error", {
            httpOnly: false,
            maxAge: 5000
        });
        console.log(error);
    }
}

// Authenticate user
const authenticateUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        const user = await UserModel.findOne({ userEmail });

        // ❌ User not found
        if (!user) {
            res.cookie("toast", "login_error", {
                httpOnly: false,
                maxAge: 5000
            });
            return res.redirect("/auth"); // ⛔ STOP HERE
        }

        const isValid = await bcrypt.compare(userPassword, user.userPassword);

        // ❌ Wrong password
        if (!isValid) {
            res.cookie("toast", "login_error", {
                httpOnly: false,
                maxAge: 5000
            });
            return res.redirect("/auth"); // ⛔ STOP HERE
        }

        // ✅ Success
        const token = jwt.sign(
            { id: user._id, userEmail: user.userEmail },
            process.env.SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.cookie("toast", "login_success", {
            httpOnly: false,
            maxAge: 5000
        });

        return res.redirect("/admin");

    } catch (error) {
        console.log(error);

        res.cookie("toast", "login_error", {
            httpOnly: false,
            maxAge: 5000
        });

        return res.redirect("/auth");
    }
};


// Logout user
const logoutUser = (req, res) => {
    res.clearCookie("token");

    res.cookie("toast", "logout_success", {
        httpOnly: false,
        maxAge: 5000
    });

    res.redirect("/");
};

const getForgotPasswordPage = (req, res) => {
    return res.render("forgotPass")
}

const forgotPassword = async (req, res) => {
    const { userEmail } = req.body

    const user = await UserModel.findOne({ userEmail })

    if (!user) {
        return res.redirect("/auth/forgot-password")
    }

    const otp = parseInt(100000 + Math.random() * 999999);
    const hashedOTP = await bcrypt.hash(otp.toString(), 10);

    user.forgotPasswordOTP = hashedOTP;
    user.forgotPasswordOTPExpiry = Date.now() + 10 * 60 * 1000
    await user.save();

    res.cookie("resetEmail", userEmail, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000
    })

    await sendMail(otp, "Send OTP For Resend Password", userEmail)
    res.redirect("/auth/reset-password")
}

const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword, confirmPassword } = req.body;

        const userEmail = req.cookies.resetEmail;

        if (!userEmail) {
            return res.redirect("/auth/forgot-password");
        }

        if (newPassword !== confirmPassword) {
            return res.redirect("/auth/reset-password");
        }

        const user = await UserModel.findOne({ userEmail });

        if (!user) {
            return res.redirect("/auth/forgot-password");
        }

        if (!user.forgotPasswordOTP || user.forgotPasswordOTPExpiry < Date.now()) {
            return res.redirect("/auth/forgot-password");
        }

        const isOTPValid = await bcrypt.compare(
            otp.toString(),
            user.forgotPasswordOTP
        );

        if (!isOTPValid) {
            return res.redirect("/auth/reset-password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.userPassword = hashedPassword;
        user.forgotPasswordOTP = undefined;
        user.forgotPasswordOTPExpiry = undefined;

        await user.save();

        res.clearCookie("resetEmail");

        return res.redirect("/auth");

    } catch (error) {
        console.error(error);
        return res.redirect("/auth/reset-password");
    }
};


module.exports = {
    renderSignUpPage,
    renderLoginPage,
    registerUser,
    authenticateUser,
    logoutUser,
    getForgotPasswordPage,
    forgotPassword,
    getResetPasswordPage,
    resetPassword
};
