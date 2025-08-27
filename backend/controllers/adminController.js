const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//LOGIN
const loginAdmin = async(req,res) => {
    const {username, password} = req.body;

    try {
        const admin = await Admin.findOne({username});
        if(!admin) {
            return res.status(401).json({message : 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }

        //create jwt Payload
        const payload = {
            adminId: admin._id,
            username: admin.username,
            role: "admin" // explicitly set role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h' });
        res.json({token});

    } catch(error) {
        res.status(500).json({message: 'Server error' });
    }
};



module.exports = {
    loginAdmin,
};