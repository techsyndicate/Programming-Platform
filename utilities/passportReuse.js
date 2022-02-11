function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect(`/profile`);
    }
    next();
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin === true) {
        return next();
    }

    res.redirect("/profile");

}

module.exports = { checkAdmin, checkAuthenticated, checkNotAuthenticated }