import orderModel from "../models/orderModel.js";
import { sendOrderNotification } from "../utils/tgOrdersBot.js";


export const createOrder = async (req, res) => {
  try {
    const { items, total, address, phone, full_name } = req.body;
    const userId = req.user.id;

    if (!items || !items.length || !total || !address || !phone) {
      return res
        .status(400)
        .json({ type: "error", message: "Заполните все обязательные данные" });
    }

    const order = await orderModel.create({
      full_name,
      userId,
      items,
      total,
      address,
      phone,
    });

 
    try {
      await sendOrderNotification(order);
    } catch (botErr) {
      console.warn("Ошибка при отправке уведомления боту:", botErr);
    }

    res.status(201).json({ type: "success", order });
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    res
      .status(500)
      .json({ type: "error", message: "Ошибка при создании заказа", err });
  }
};


export const getOrderByUserId = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ type: "success", orders });
  } catch (err) {
    console.error("Ошибка при получении заказов:", err);
    res
      .status(500)
      .json({ type: "error", message: "Ошибка при получении заказов" });
  }
};
