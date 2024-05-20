import { transporter } from "../config/nodemailer"
import { Resend } from 'resend';

interface IEmail {
    email: string
    name: string
    token: string
}

const resend = new Resend('re_FPnKgyJL_2GQSL7kPdkg8aEQTRB2mqZX3');

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await resend.emails.send({
            from: 'UpTask <admin@task.com>',
            to: user.email,
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
          });

        console.log('mensaje enviado')
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@task.com>',
            to: user.email,
            subject: 'UpTask - Reestablece tu password',
            text: 'UpTask - Reestablece tu password',
            html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            
            `
        })

        console.log('mensaje enviado', info.messageId)
    }
}