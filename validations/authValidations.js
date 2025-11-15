import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("full_name")
    .isLength({ min: 2 })
    .withMessage("Имя должно содержать минимум 2 символа"),
  body("gmail").isEmail().withMessage("Некорректный email"),
  body("phone")
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("Некорректный номер телефона"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен быть минимум 6 символов"),
];


export const loginValidation = [
  body("gmail").isEmail().withMessage("Некорректный gmail"),
  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("Пароль должен быть минимум 6 символов"),
];

export const resetPasswordValidation = [
    
]