const asyncHandler = require('express-async-handler')

// @desc: Get Goals
// @route: GET /api/goals
// @access: Private
const getGoals = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'GET Goals API'})
})

// @desc: Post Goals
// @route: POST /api/goals
// @access: Private
const postGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please enter a goal')
    }

    res.status(200).json({message: 'POST Goals API'})
})

// @desc: Put Goal
// @route: PUT /api/goal/:id
// @access: Private
const putGoal = asyncHandler(async (req, res) => {
    res.status(200).json({message: `PUT Goal API ${req.params.id}`})
})

// @desc: Delete Goal
// @route: DELETE /api/goal/:id
// @access: Private
const deleteGoal = asyncHandler(async (req, res) => {
    res.status(200).json({message: `DELETE Goal API ${req.params.id}`})
})

module.exports = {
    getGoals, postGoals, putGoal, deleteGoal
}