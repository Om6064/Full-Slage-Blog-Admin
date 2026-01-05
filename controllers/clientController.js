const BlogModel = require("../models/blogModel");

const getClientPage = async(req,res) => {
    const blogs = await BlogModel.find();
    res.render("home", { blogs });
}

module.exports = getClientPage