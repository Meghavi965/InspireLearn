const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../config/User');

// Sign Up Page
router.get('/signup', (req, res) => res.render('signup'));

// Sign In Page
router.get('/signin', (req, res) => res.render('signin'));

// Sign Up Handle
router.post('/signup', (req, res) => {
    const { name, email, phone, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !phone || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            name,
            email,
            phone,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already registered' });
                    res.render('signup', {
                        errors,
                        name,
                        email,
                        phone,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        password
                    });

                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/signin');
                        })
                        .catch(err => console.log(err));
                }
            });
    }
});

// Sign In Handle
router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/assessment',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/signin');
});

module.exports = router;
