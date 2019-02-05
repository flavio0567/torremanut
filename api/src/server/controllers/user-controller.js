const User   = require('../models/user-model');
const jwt    = require('jsonwebtoken');
const config = require('../config/config');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email}, config.jwtSecret, {
        expiresIn: 86400
    });
}

exports.registerUser = (req, res) => {
    if (!req.body.email || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Favor digitar email e senha'});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (user) {
            return res.status(400).json({ 'msg': 'Usuário já existente' });
        }

        let newUser = User(req.body);
        console.log('user', newUser);
        newUser.save((err, user) => {
            if (err) {
                console.log('err', err);
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(user);
        })
    })

}

exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.senha) {
        return res.status(400).json({ 'msg': 'Favor digitar email e senha'});
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (!user) {
            return res.status(400).json({ 'msg': 'Usuário não existente' });
        }

        user.comparePassword(req.body.senha, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                });            
            } else {
                return res.status(400).json({
                    msg: 'Email e senha informados não compatívies'
                })
            }
        })
    })

}