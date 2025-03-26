const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')

// @desc: Get Goals
// @route: GET /api/goals
// @access: Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find()
    res.status(200).json(goals)
})

// @desc: Post Goals
// @route: POST /api/goals
// @access: Private
const postGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please enter a goal')
    }

    const goal = await Goal.create({
        text: req.body.text
    })

    res.status(200).json(goal)
})

// @desc: Put Goal
// @route: PUT /api/goal/:id
// @access: Private
const putGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(404)
        throw new Error('Goal not found')
    }

    const upadatedGoal = await Goal.findByIdAndUpdate(req.params.id,  req.body, {
        new: true
    })

    res.status(200).json(upadatedGoal)
})

// @desc: Delete Goal
// @route: DELETE /api/goal/:id
// @access: Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(404)
        throw new Error('Goal not found')
    }

    await Goal.findByIdAndDelete(req.params.id)
    res.status(200).json({message: `DELETE Goal API ${req.params.id}`})
})

module.exports = {
    getGoals, postGoals, putGoal, deleteGoal
}

