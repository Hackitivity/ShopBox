const User = require("../models/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.registerUser = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(400).json({ msg: "User already exists" })
    }
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
    })
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)
    await newUser.save()
    res.status(200).json({ msg: "User created successfully" })
}

exports.loginUser = async (req, res) => {
    //Login User
    const user = User.findOne({
        username: req.body.username,
    })
    if (!user) {
        return res.status(400).json({ msg: "User does not exist" })
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password)
    if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password" })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 3600,
    })
    res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    })
}