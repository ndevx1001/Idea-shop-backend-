import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv'

dotenv.config()


const token = process.env.TG_BOT_TOKEN
export const chatId = process.env.ADMIN_CHAT_ID


export const bot = new TelegramBot(token, { polling: false })


export const sendOrderNotification = async(order) => {
    try{
    

        const message =  `
🛒 *Новый заказ!*
Имя: ${order.full_name}
👤 userId: ${order.userId}
📞 Телефон: ${order.phone}
🏠 Адрес: ${order.address}
💰 Сумма: ${order.total} сом
🧾 Товары:
${order.items.map((i) => `- ${i.name} × ${i.quantity} = ${i.price * i.quantity}`).join("\n")}
    `;

    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' })

    } catch(err){
         console.error("Ошибка при отправке уведомления боту:", err);
    }
}