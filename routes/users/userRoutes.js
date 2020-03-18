const express = require("express");
const router = express.Router();
const User = require("./models/Users");
const passport = require('passport')
const bcrypt = require("bcryptjs");
require('../../lib/passport')

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/success', (req, res) => {
    if(req.isAuthenticated()) {
        return res.render('success')
    } else {
        res.send('Unauthorized!')
    }
})

router.get('/fail', (req, res) => {
    return res.render('fail')
})

const myValidation = (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(403).json({ message: "All Inputs must be Filled" });
    }
    next()
}

router.get('/register', (req, res) => {
    res.render('register')
})

router.post("/register", myValidation, (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
        if (user) {
            return res.status(400).json({ message: "User Already Exists!" });
        }

        const newUser = new User();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = hash;

        newUser
            .save()
            .then(user => {
                return req.login(user, (err) => {
                    if(err) {
                        return res.status(500).json({message: 'Server Error', err})
                    } else {
                        console.log(req.session)
                        res.redirect('/users/success')
                    }
                })
            })
            .catch(err =>
            res.status(400).json({ message: "User Not Saved!", err })
            );
        })
        .catch(err => res.status(418).json({ message: "Error!", err }));
    });

    router.post('/login',
        passport.authenticate('local-login', {
            successRedirect: '/users/success',
            failureRedirect: '/users/fail',
            failureFlash: true
        })
    )

    router.get('/logout', (req, res) => {
        req.session.destroy() 
        console.log(req.session)
        req.logout()
        return res.redirect('/')
    })


module.exports = router;