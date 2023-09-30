import express from "express"
import { getUsers, register, login, logout } from "../Controllers/UserController.js"
import { createEvent, editEvent, deleteEvent, getAllEvents } from "../Controllers/EventController.js"
import { verifyToken } from "../Middleware/VerifyToken.js"
import { refreshToken } from "../Controllers/RefreshToken.js"

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.get('/token', refreshToken)
router.get('/events', getAllEvents)

router.post('/users', register)
router.post('/login', login)
router.post('/events', createEvent)

router.put('/events/:id', editEvent)

router.delete('/logout', logout)
router.delete('/events/:id', deleteEvent)

export default router