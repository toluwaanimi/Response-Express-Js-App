const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrpyt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(
            userFound => {
                if (userFound.length >= 1) {
                    return res.status(200).json({
                        message: 'User Exist',
                        status: false
                    })
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            })
                        } else {
                            const user = new User({
                                fullName: req.body.fullName,
                                phoneNumber: req.body.phoneNumber,
                                email: req.body.email,
                                password: hash
                            });
                            user.save().then(
                                userResponse => {
                                    res.status(200).json({
                                        message: 'User created',
                                        userDetails: userResponse,
                                        status: true
                                    })
                                }
                            ).catch(
                                err => {
                                    res.status(200).json({
                                        error: err,
                                        status: false
                                    })
                                }
                            )

                        }
                    })
                }
            }
        )
});

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email}).exec()
        .then(
            userFound => {
                if (userFound < 1) {
                    res.status(200).json({
                        message: 'User not found'
                    })
                }
                bcrypt.compare(req.body.password, userFound[0].password, (err, response) => {
                    if (err) {
                        res.status(200).json({
                            error: err,
                            status: false,
                            message: 'Incorrect Password'
                        })
                    }
                    if (response) {
                        const token = jwt.sign({
                                email: userFound[0].email,
                                password: userFound[0].password
                            }, 'key', {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(200).json(
                            {
                                status: true,
                                token: token
                            }
                        )

                    }
                    else {
                        res.status(200).json({
                            message: 'Incorrect Password',
                            status: false
                        })
                    }
                    res.status(200).json({
                        message: 'Auth Failed'
                    })
                })
            }
        ).catch(
            err => {
                res.status(500).json({
                    error : err
                })
            }
    )
});

module.exports = router;
