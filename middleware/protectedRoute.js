const jwt = require("jsonwebtoken");

const isLogin = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.redirect("/auth");
    }

    const validToken = jwt.verify(token, process.env.SECRET);
    // console.log(validToken);
    

    req.data = validToken;
    next();
};

module.exports = {isLogin};
