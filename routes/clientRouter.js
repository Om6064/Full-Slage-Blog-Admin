const express = require("express")
const getClientPage = require("../controllers/clientController")
const router = express.Router()

router.get("/",getClientPage)

module.exports = router