const User = require('../models/user');


const profile = async (req, res) => {
    const user_id = req.user.user_id;
    const email = req.user.email;

    try {
        const userDetails = await User.findById(user_id);

        if (!userDetails) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({
            user_id: userDetails.user_id,
            name: userDetails.name,
            email: email,
            phone: userDetails.phone
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = profile;