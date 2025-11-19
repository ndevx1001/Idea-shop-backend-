import express from "express";
import { registerUser, loginUser, googleLogin, completeProfile, resetPassword, verifyResetCode, setNewPassword, updateUser } from "../controllers/authControllers.js";
import { loginValidation, registerValidation } from "../validations/authValidations.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router()


router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/google', googleLogin)
router.patch('/complete_profile', completeProfile)
router.post('/restore_password', resetPassword)
router.post('/restore_password/verify', verifyResetCode)
router.post('/restore_password/new', setNewPassword)
router.put('update-user', verifyToken, updateUser)


export default router
