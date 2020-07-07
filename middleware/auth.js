exports.checkAdmin = async (req, res, next) => {
    if(!req.user) {
        return res.redirect('/')
    }

    if(!req.user.isAdmin) {
        return res.redirect('/')
    }

    next()
}

exports.checkUser = async (req, res, next) => {
    if(!req.user) {
        return res.redirect('/')
    }

    next()
}