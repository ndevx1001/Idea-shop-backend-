import express from 'express'
import { createOrder, getOrderByUserId } from '../controllers/orderController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()


router.post('/', verifyToken, createOrder)


router.get('/', verifyToken, getOrderByUserId)

export default router
