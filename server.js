import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import productRouter from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import ordersRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const CONNECT_MONGO = process.env.MONGO_URL || 8080

mongoose.connect(CONNECT_MONGO)
    .then(() => console.log('Mongo connected'))
    .catch(err => console.log('Error with connect ' + err))


app.use(cors({ origin: ["https://idea-shop.onrender.com", "http://localhost:5173/", process.env.CLIENT_URL] , credentials: true }))
app.use(express.json())


app.use('/products', productRouter)
app.use('/auth', authRoutes)
app.use('/orders', ordersRoutes)
app.use('/admin', adminRoutes)
app.get('/', (req, res) => res.send('Hello World'));


app.listen(PORT, () => {
    console.log(`Server runned in ${PORT} port`)
})
