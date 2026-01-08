const express = require("express");

const {
    renderLoginPage,
    renderSignUpPage,
    registerUser,
    authenticateUser,
    logoutUser,
    getForgotPasswordPage,
    forgotPassword
} = require("../controllers/authController.js");

const router = express.Router();

router.get("/", renderLoginPage);
router.get("/sign-up", renderSignUpPage);
router.get("/forgot-password", getForgotPasswordPage)
router.post("/sign-up", registerUser);
router.post("/", authenticateUser);
router.post("/log-out", logoutUser);
router.post("/forgot-password", forgotPassword)

module.exports = router;
