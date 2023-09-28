import express from "express"
import { getUsers, register, login, logout } from "../Controllers/UserController.js"
import { verifyToken } from "../Middleware/VerifyToken.js"
import { refreshToken } from "../Controllers/RefreshToken.js"

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.post('/users', register)
router.post('/login', login)
router.get('/token', refreshToken)
router.delete('/logout', logout)

export default router