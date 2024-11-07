const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const {check, validationResult} = require('express-validator')

router.post('/register', 
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password must be atleast 6 characters').isLength({min: 6}),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const {username, email, password} = req.body;

            const existingUser = await User.findOne({email});
            if (existingUser){
                return res.status(400).json({message: 'User already exists'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({username, email, password: hashedPassword});
            await newUser.save();
            res.status(201).json({message: 'User registered successfully'})
        } catch (error) {
            res.status(500).json({message: error.message});
        }
});

router.post('/login', 
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()})
        }
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message: 'Invalid credentials'});
            }

            const isMatch = await await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message: 'Invalid credentials'});
            }

            const token = jwt.sign({userID: user._id}, process.env.jwtSecret, {expiration: '1h'});
            res.json({token});
        } catch (error) {
            res.status(500).json({message: error.message})
        }
});

module.exports = router;