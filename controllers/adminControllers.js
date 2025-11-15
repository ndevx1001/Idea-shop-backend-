import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"

export const getAllUsers = async(req, res) => {
    try{
        const users = await userModel.find({}, "gmail full_name role")
        res.status(200).json({ type: 'success', messsage: "Успешно получено: ", users })
    } catch(err){
     res.status(500).json({ type: 'error', message: 'Ошибка при получении пользователей' })
    }
}


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res
        .status(400)
        .json({ type: "error", message: "Введите статус заказа" });
    }

    const order = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ type: "error", message: "Заказ не найден" });
    }

    res.status(200).json({
      type: "success",
      message: "Статус заказа успешно обновлён",
      order,
    });
  } catch (err) {
    res.status(500).json({
      type: "error",
      message: "Ошибка при обновлении заказа",
      err,
    });
  }
};