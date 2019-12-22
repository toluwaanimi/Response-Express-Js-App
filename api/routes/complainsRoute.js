const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Complain = require('../models/complainModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});
const checkAuth = require('../middleware/check-auth');
router.get('/allComplains', (req, res, next) => {
    Complain.find({}, (err, result) => {
        if (err)
            return err;
        res.send(result)

    })
});

router.post('/submit', upload.single('subjectImage'), (req, res, next) => {
    const complainObject = new Complain({
        subjectImage: req.file.path,
        subjectHeading: req.body.subjectHeading,
        subjectMessage: req.body.subjectMessage,
        subjectEmail: req.body.subjectEmail
    });
    complainObject.save().then(
        result => {
            res.status(200).json({
                status: true,
                message: 'Complain submitted'
            })
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err

            })
        }
    )

});


router.get('/response', (req, res, next) => {
    Complain.find({email: req.body.subjectEmail}).exec().then(
        userComplains => {
            if (userComplains.length < 1){
                return res.status(200).json({
                    message: 'No complain',
                    status: false
                })
            } else {
                res.status(200).json({
                    complains : userComplains,
                    status: true
                })
            }
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err
            })
        }

    )
});

router.patch('/response/:complainId', (req, res, next)=>{
    const _id = req.params.complainId
    const updateOps = {};
    //it gets an JsonArray of format
    // [{propName: "objectName",value: "newValue"}]
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Complain.update({id: _id},{$set: updateOps}).exec().then(
        result => {
            res.status(200).json({
                message: 'Complain Updated',
                status: true
            })
        }
    ).catch(
        err =>{
            res.status(500).json({
                error: err
            })
        }
    )
});

module.exports = router;
