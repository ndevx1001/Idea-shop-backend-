import { Router } from "express";
import { getAllProducts, getProductsById } from "../controllers/productsControllers.js";
import productModel from "../models/productModel.js";
import path from 'path'
import fs from 'fs'


const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductsById)



export default router