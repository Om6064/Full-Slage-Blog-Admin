const express = require("express");

const {
    renderLoginPage,
    renderSignUpPage,
    registerUser,
    authenticateUser,
    logoutUser,
    getForgotPasswordPage,
    forgotPassword,
    getResetPasswordPage,
    resetPassword,
    getInteanstailResetPasswordPage,
    inteanstailResetPassword
} = require("../controllers/authController.js");

const router = express.Router();

router.get("/", renderLoginPage);
router.get("/sign-up", renderSignUpPage);
router.get("/forgot-password", getForgotPasswordPage)
router.get("/reset-password", getResetPasswordPage)
router.get("/iReset-password", getInteanstailResetPasswordPage);
router.post("/sign-up", registerUser);
router.post("/", authenticateUser);
router.post("/log-out", logoutUser);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/iReset-password",inteanstailResetPassword)

module.exports = router;
