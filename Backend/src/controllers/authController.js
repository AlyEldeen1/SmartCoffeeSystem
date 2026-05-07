const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
// REGISTER CONTROLLER
exports.register = async(req, res) => {
    const { name, email , password, phone_number, role } = req.body;
    try {
        // 1. check if user already exists 
        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            return res.status(400).json({ message: 'This Email already exists' });
        }
        // 2. hash password
         const password_hash = await bcrypt.hash(password, 10);
        // 3. create user 
        const newUser = await createUser(name, email , phone_number, password_hash, role || 'customer');
        // 4. return response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// LOGIN CONTROLLER
exports.login = async(req, res) => {
    const { email, password } = req.body;
try {
    // 1. find user by email
    const user = await getUserByEmail(email);
    if(!user) {
        return res.status(400).json({ error: 'email not found'});
    }
    // 2. check password
    const isMatch= await bcrypt.compare(password, user.password_hash);
    if(!isMatch) {
        return res.status(400).json({ error: 'invalid password'});
    }
    // 3. create token
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            loyalty_points: user.loyalty_points,
            is_verified: user.is_verified,
            created_at: user.created_at
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // 4. send response
    res.json({
            message: 'Login successful',
            token,
            user: {
                id : user.id,
                name: user.name ,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
