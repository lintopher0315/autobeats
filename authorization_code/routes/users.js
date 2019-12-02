const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/count', (req, res) => {
    console.log("hello")
    User.find({'name': req.body.name}, function(err, user) {
        if (user == null || user.length == 0) {
            User.create({'name': req.body.name, 'numPlays': req.body.numPlays}, (err, user) => {
                if (err) throw err;
                res.send({user: user, status: 200})
            })
        }
        else {
            User.findOneAndUpdate({'name': req.body.name}, {$inc: {'numPlays': req.body.numPlays}}, (err, user) => {
                if (err) throw err;
                res.send({user: user, status: 200})
            })
        }
    })
})

module.exports = router