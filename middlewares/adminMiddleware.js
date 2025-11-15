// middleware/isAdmin.js
import userModel from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
  
    if (!req.user || !req.user.id) {
      return res.status(401).json({ type: "error", message: "Не авторизован" });
    }

   
    const user = await userModel.findById(req.user.id);

    
    if (!user) {
      return res.status(404).json({ type: "error", message: "Пользователь не найден" });
    }

   
    if (user.role !== "admin") {
      return res.status(403).json({ type: "error", message: "Доступ запрещен" });
    }


    next();
  } catch (err) {
    console.error("Ошибка проверки администратора:", err);
    return res.status(500).json({ type: "error", message: "Ошибка проверки пользователя" });
  }
};
