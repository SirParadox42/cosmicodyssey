const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const User = require('../models/user');

exports.signup = async(req, res, next) => {
    const errors = validationResult(req);
    const {username, email, password} = req.body;
    const file = req.file.path;

    if (!errors.isEmpty()) {
        fs.unlink(file, err => console.log(err));
        return res.status(422).json({message: 'Invalid inputs passed, please check your data.'});
    }

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(401).json({message: 'User already exists.'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({username, email, password: hashedPassword, image: file});
        await user.save();
        const token = jwt.sign({userId: user.id}, process.env.JWT_KEY);
        return res.status(201).json({token: token, userId: user.id, image: user.image});
    } catch(err) {
        return res.status(500).json({message: 'Signup failed.'});
    }
};

exports.login = async(req, res, next) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        const isValid = await bcrypt.compare(password, existingUser.password);
        
        if (!existingUser || !isValid) {
            return res.status(401).json({message: 'Invalid email or password.'});
        }

        const token = jwt.sign({userId: existingUser.id}, process.env.JWT_KEY);
        return res.status(200).json({token, userId: existingUser.id, image: existingUser.image});
    } catch(err) {
        return res.status(500).json({message: 'Login failed.'});
    }
};