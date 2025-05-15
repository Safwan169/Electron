const User = require("../../models/shema/User");
const { comparePassword } = require("../../utils/bcryptPassword");
const genrateToken = require("../../utils/generateToken");
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        })
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        })
    }
    const isPasswordMatch = await comparePassword(password, user.password)
    if (!isPasswordMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        })
    }

    const token = await genrateToken(user);

    if (!token ) {
        return res.status(500).json({
            success: false,
            message: 'Failed to generate token'
        })
    }


    console.log(token,'token')

res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
})

    res.status(200).json({
        success: true,
        message: 'Login successful'
    })
}

module.exports = login;

