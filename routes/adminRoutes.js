import { Router } from "express"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/adminMiddleware.js"
import { getAllUsers, updateOrderStatus } from "../controllers/adminControllers.js"


const router = Router()

router.get('/users', verifyToken, isAdmin, getAllUsers )
router.patch('/orders/:id', verifyToken, isAdmin, updateOrderStatus)

export default router