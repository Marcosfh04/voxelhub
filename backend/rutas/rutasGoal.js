const express = require('express')
const router = express.Router()
const{getGoals,postGoals,putGoal,deleteGoal} = require('../controllers/goalController')


const {protect} = require('../middleware/authMiddleware')

router.route('/').get(protect, getGoals).post(protect, postGoals)
router.route('/:id').put(protect, putGoal).delete(protect, deleteGoal)

module.exports = router


