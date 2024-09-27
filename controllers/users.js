const user = require("../models/user");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new user({ email, username });
        const registeredUser = await user.register(newuser, password);
        //console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to WanderLust!");
            res.redirect("/listings");
        })

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.Logout = (req, res) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};