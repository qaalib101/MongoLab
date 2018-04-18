/**
 * Created by si8822fb on 4/17/2018.
 */
var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res, next){
    res.render('authentication');
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));


router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}));


router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/')
});
module.exports = router;