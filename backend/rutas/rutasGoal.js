const express = require('express')
const router = express.Router()
const{getGoals,postGoals,putGoal,deleteGoal} = require('../controllers/goalController')

router.route('/').get(getGoals).post(postGoals)
router.route('/:id').put(putGoal).delete(deleteGoal)

module.exports = router


