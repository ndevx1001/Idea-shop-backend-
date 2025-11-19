import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { OAuth2Client } from "google-auth-library"
import { body, validationResult } from "express-validator"
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail.js"



dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const registerUser = async (req, res) => {
   try{
       const {full_name, gmail, phone, password } = req.body


       const errors = validationResult(req)

       if(!errors.isEmpty()) return res.status(400).json({ type: 'error', message: errors.array() })
      

       const existing_user = await userModel.findOne({ gmail: gmail })

       if(existing_user) return res.status(400).json({ type: 'error', message: 'Такой пользователь существует' })


        const hashed_password = await bcrypt.hash(password, 10)
       

        const newUser = await userModel.create({
            full_name,
            gmail, 
            phone,
            password: hashed_password    
        })


        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })


        
        res.status(201).json({ type: 'success', user: newUser, jwt: token })

    } catch(err){
        console.log(err)
        res.status(500).json({ type: "error", message: "Ошибка сервера" })
    }
}

export const googleLogin = async (req, res) => {
    try{

        const { credential } = req.body;

        if(!credential) return res.status(400).json({type: 'success', message: 'Нет google credential'});

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        
        const payload = ticket.getPayload();
        const { email, sub: googleId } = payload;

        let user = await userModel.findOne({ gmail: email })
        
        if(!user){
                user = await userModel.create({
                gmail: email,
                googleId
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        const needsProfile = !user.phone || !user.full_name

         res.json({ type: "success", user, jwt: token, needsProfile: needsProfile });


    } catch(err){
        console.log('Ошибка: ', err);
        res.status(500).json( { type: 'error', message: 'Ошибка Google Login' } )
    }
}

export const completeProfile = async(req, res) => {
    try{
        const {userId, phone, full_name } = req.body

        if(!phone || !full_name) return res.status(403).json({ type: "error", message: "Ввведите данные" })
         
        const user = await userModel.findByIdAndUpdate(userId,
            { full_name, phone },
            { new: true }
        )
        
          res.json({ type: "success", user });

    } catch(err){
        res.status(500).json({ type: 'error', message: err })
        console.log(err);
        
    }
}

export const loginUser = async(req, res) => {
    try{
        const { gmail, password } = req.body

        const errors = validationResult(req)

        if(!errors.isEmpty()) return res.status(400).json({ type: "failed", message: errors.array() })

        const existing_user = await userModel.findOne({ gmail: gmail })
        
        if(!existing_user) return res.status(404).json({ type: "error", message: "Пользователь с таким gmail не найден" })
        
        const isMatch = await bcrypt.compare(password, existing_user.password)
        
        if(!isMatch) return res.status(400).json({ type: "error", message: "Неверный пароль" })
        
        const token = jwt.sign({ id: existing_user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        
        return res.status(200).json({ type: "success" , existing_user, jwt: token })

    } catch(err){
        console.log( "Ошибка: ", err)
        res.status(500).json({ type: "error", message: "Ошибка от сервера" })
    }
}




export const resetPassword = async (req, res) => {
    try {
        const { gmail } = req.body;

        if (!gmail) return res.status(400).json({ type: 'error', message: "Введите email" });

        const user = await userModel.findOne({ gmail });
        if (!user) return res.status(404).json({ type: 'error', message: "Пользователь не найден" });

       
        const resetCode = crypto.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        user.resetCode = resetCode;
        user.resetCodeExpires = expires;
        await user.save();

    
        await sendEmail(user.gmail, "Сброс пароля", `Ваш код для сброса пароля: ${resetCode}`);

        res.status(200).json({ type: 'success', message: "Код отправлен на почту" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ type: 'error', message: "Ошибка сервера" });
    }
};


export const verifyResetCode = async (req, res) => {
    try{
        const { gmail, code } = req.body

        if(!gmail || !code) return res.status(400).json({ type: 'error', message: 'Введите данные' })

        const user = await userModel.findOne({gmail: gmail})
        if(!user) return res.status(404).json({ type: 'error', message: 'Пользователь не найден' })

        if(user.resetCode !== code) return res.status(400).json({type: 'error', message: 'Неверный код' })
            
        if(user.resetCodeExpires < Date.now())return res.status(400).json({ type: 'error', message: 'Срок просрочен' })
            
            
        user.resetCode = null
        user.resetCodeExpires = null
        user.canReset = true

        await user.save()

        res.status(200).json({ type: 'error', message: 'Правильный код' })

    } catch(err){
        console.table(err);
        res.json(500).json({ type: 'error', message: 'error status: 500' })
    }
}


export const setNewPassword = async(req, res) => {
    try{
        const { gmail, newPassword } = req.body

        

        if(!gmail || !newPassword )return res.status(400).json({ type: 'error', message: 'Заполните все поля' })

         const user = await userModel.findOne({ gmail: gmail })
        if(!user) return res.status(404).json({ type: 'error', message: 'Пользователь не найден' }) 

        if (!user.canReset)
            return res.status(403).json({ type: 'error', message: 'Вы не подтвердили код' });


          const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.canReset = false;
        await user.save();

        res.status(200).json({ type: 'success', message: 'Пароль успешно изменён' });  

    } catch(err){
        res.status(500).json({ type: 'error', message: 'Status: 500' })
    }
}


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { full_name, phone, gmail, password } = req.body;

    if (!full_name || !phone || !gmail) {
      return res.status(400).json({ type: "error", message: "Заполните все обязательные поля" });
    }

    const updateData = { full_name, phone, email };

    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    return res.status(200).json({ type: "success", user: updatedUser });
  } catch (err) {
    console.error("Ошибка при обновлении профиля:", err);
    res.status(500).json({ type: "error", message: "Ошибка сервера" });
  }
};