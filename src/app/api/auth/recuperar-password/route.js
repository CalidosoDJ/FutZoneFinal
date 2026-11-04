import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "El correo electrónico es requerido." },
                { status: 400 }
            );
        }

        // 1. Buscar usuario con los nombres de columna reales
        const [rows] = await pool.execute(
            "SELECT id_usuario, nombre_completo FROM usuarios WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Si el correo está registrado, recibirás las instrucciones." },
                { status: 200 }
            );
        }

        const usuario = rows[0];

        // 2. Generar token y expiración
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        // 3. Actualizar token filtrando por email
        await pool.execute(
            "UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
            [resetToken, expires, email]
        );

        // 4. Configurar Nodemailer con tu Gmail
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SERVER_USER || "joaquiduvan61@gmail.com",
                pass: process.env.EMAIL_SERVER_PASSWORD || "xguwmucosbljmsig",
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // 5. Enviar Correo con la plantilla de FutZone
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || `FutZone <${process.env.EMAIL_SERVER_USER || "joaquiduvan61@gmail.com"}>`,
            to: email,
            subject: "⚽ Restablece tu contraseña - FutZone",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f3f4f6; padding: 20px; border-radius: 12px;">
                    <div style="background-color: #16a34a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 2px;">
                            FUT<span style="color: #dcfce7;">ZONE</span>
                        </h1>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; color: #1f2937;">
                        <h2 style="color: #1f2937; margin-top: 0;">¡Hola, ${usuario.nombre_completo || "Jugador"}!</h2>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>FutZone</strong>.
                        </p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.5;">
                            Haz clic en el siguiente botón para crear una nueva contraseña. Este enlace expira en <strong>15 minutos</strong>:
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #16a34a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="font-size: 13px; color: #6b7280;">
                            Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                            FutZone — Canchas Sintéticas en Popayán
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json(
            { message: "Instrucciones enviadas correctamente al correo." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al solicitar recuperación:", error);
        return NextResponse.json(
            { message: error.message || "Error interno del servidor." },
            { status: 500 }
        );
    }
}