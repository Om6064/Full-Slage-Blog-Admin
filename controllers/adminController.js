const BlogModel = require("../models/blogModel.js");
const fs = require("fs");
const path = require("path");

// Home page controller
const getHomePage = async (req, res) => {
  try {
    const data = await BlogModel.find({}).populate("author", "userName");
    res.render("index", { blogs: data });
  } catch (error) {
    console.log(error);
  }
};

// Render blog creation form
const renderBlogForm = (req, res) => {
  res.render("blogForm");
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { path: imagePath } = req.file;

    const blogData = new BlogModel({
      ...req.body,
      blogImage: imagePath,
      author: req.data.id
    });

    await blogData.save();

    res.cookie("toast", "blog_create_success", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  } catch (error) {
    console.log(error);

    res.cookie("toast", "blog_create_error", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  }
};

// Delete a blog
const removeBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await BlogModel.findById(id);
    if (!data) {
      throw new Error("Blog not found");
    }

    const imgPath = path.join(__dirname, "..", data.blogImage);
    fs.unlink(imgPath, err => err && console.log(err));

    await BlogModel.findByIdAndDelete(id);

    res.cookie("toast", "blog_delete_success", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  } catch (error) {
    console.log(error);

    res.cookie("toast", "blog_delete_error", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  }
};

// Render edit form
const renderEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await BlogModel.findById(id);
    res.render("editForm", { data });
  } catch (error) {
    console.log(error);
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;

    if (req.file) {
      const data = await BlogModel.findById(id);
      const imgPath = path.join(__dirname, "..", data.blogImage);
      fs.unlink(imgPath, err => err && console.log(err));

      updatedData.blogImage = req.file.path;
    }

    await BlogModel.findByIdAndUpdate(id, updatedData);

    res.cookie("toast", "blog_update_success", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  } catch (error) {
    console.log(error);

    res.cookie("toast", "blog_update_error", {
      httpOnly: false,
      maxAge: 5000
    });

    return res.redirect("/admin");
  }
};

// Quick view blog
const renderQuickView = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);
    res.render("quickView", { blog });
  } catch (error) {
    console.log(error);
  }
};

// Show logged-in user's blogs
const showMyBlogs = async (req, res) => {
  try {
    const { id } = req.data;
    const myBlogs = await BlogModel.find({ author: id });

    return res.render("myBlogs", { myBlogs });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getHomePage,
  renderBlogForm,
  createBlog,
  removeBlog,
  renderEditForm,
  updateBlog,
  renderQuickView,
  showMyBlogs
};
