import express from "express"
import { getAllUsers, deleteUser, editUser, createUser } from "../Controllers/UserController.js"
import { createEvent, editEvent, deleteEvent, getAllEvents } from "../Controllers/EventController.js"
import { login , register } from "../Controllers/AuthController.js"
import { verifyToken } from "../Middleware/VerifyToken.js"
import { refreshToken } from "../Controllers/RefreshToken.js"

const router = express.Router()

router.get('/users', verifyToken, getAllUsers)
router.get('/token', refreshToken)
router.get('/events', getAllEvents)

router.post('/users', register)
router.post('/login', login)
router.post('/events', createEvent)
router.post('/users', createUser)

router.put('/events/:id', editEvent)
router.put('/users/:id', editUser)

router.delete('/logout', logout)
router.delete('/events/:id', deleteEvent)
router.delete('/users/:id', deleteUser)

export default router