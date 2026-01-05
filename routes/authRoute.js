const express = require("express");
const {
    renderLoginPage,
    renderSignUpPage,
    registerUser,
    authenticateUser,
    logoutUser
} = require("../controllers/authController.js");

const router = express.Router();

router.get("/", renderLoginPage);
router.get("/sign-up", renderSignUpPage);
router.post("/sign-up", registerUser);
router.post("/", authenticateUser);
router.post("/log-out", logoutUser);

module.exports = router;
