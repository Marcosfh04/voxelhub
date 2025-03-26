const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

//@desc    Register a new user
//@route   POST /api/users
//@access  Public

const registerUser = asyncHandler(async (req, res) => { 
    res.json({message: 'Usuario registrado'})
})

//@desc   Authenticate a user
//@route  POST /api/users/login
//@access Public

const loginUser = asyncHandler(async (req, res) => {
    res.json({message: 'Usuario logueado'})
})

//@desc  Get user data
//@route GET /api/users/me
//@access Private

const getMe = asyncHandler(async (req, res) => {
    res.json({message: 'Perfil de usuario'})
})


module.exports = { registerUser, loginUser, getMe }