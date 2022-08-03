const router = require('express').Router()
import { verifyToken } from '../middleware/auth'

import { fetchAllUser, login } from '../controller/UserController'

router.get('/', verifyToken, fetchAllUser)
router.post('/login', login)

module.exports = router;