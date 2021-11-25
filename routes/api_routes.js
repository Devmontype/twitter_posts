const express=require('express');

const route=express.Router();
const user_paths=require('../controllers/user');

//middleware
function check_session(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error_msg="Please login to proceed"
        res.redirect("/");
    }
}

//visited after login
function check_logged_in(req, res, next) {
    if (req.session.user) {
        res.redirect("/dashboard");
    } else {
        next();
    }
}


route.get('/',check_logged_in, user_paths.signin)
route.post('/signin',check_logged_in,user_paths.signin)
route.all('/signup',check_logged_in,user_paths.signup)
route.get('/signout',check_session, user_paths.signout)
route.post('/addpost',user_paths.addPost)
route.get('/dashboard',check_session,user_paths.dashboard)
route.post('/follow_unfollow',user_paths.follow_unfollow_user)
route.post('/email_exist',user_paths.check_email_exist)



module.exports={route};