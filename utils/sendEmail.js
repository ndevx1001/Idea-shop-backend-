import nodemailer from 'nodemailer'


export const sendEmail = async (to, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        })

        await transporter.sendMail( {
            from: `"Idea-Shop Support" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text
        })

        console.log('Письмо успешно отправлено на: ', to);
    } catch(err){
        console.log("Ошибка при отправке письма: ", err);
    }
}