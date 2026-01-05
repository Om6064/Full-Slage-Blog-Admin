const express = require("express");
const {
    getHomePage,
    renderBlogForm,
    createBlog,
    removeBlog,
    renderEditForm,
    updateBlog,
    renderQuickView,
    showMyBlogs
} = require("../controllers/adminController.js");

const upload = require("../middleware/multer.js");

const router = express.Router();

router.get("/", getHomePage);
router.get("/add-blog", renderBlogForm);
router.post("/add-blog", upload.single("blogImage"), createBlog);
router.get("/delete-blog/:id", removeBlog);
router.get("/edit-form/:id", renderEditForm);
router.post("/edit-blog/:id", upload.single("blogImage"), updateBlog);
router.get("/quick-view/:id", renderQuickView);
router.get("/my-blogs", showMyBlogs)

module.exports = router;
