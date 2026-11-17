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

        const emailLimpio = String(email).trim().toLowerCase();

        // 1. Buscar usuario en MySQL por correo
        const [rows] = await pool.execute(
            "SELECT id_usuario, nombre_completo FROM usuarios WHERE LOWER(email) = ?",
            [emailLimpio]
        );

        if (rows.length === 0) {
            // Mensaje neutro por seguridad para no revelar qué correos existen
            return NextResponse.json(
                { message: "Si el correo está registrado en FutZone, recibirás las instrucciones en breve." },
                { status: 200 }
            );
        }

        const usuario = rows[0];

        // 2. Generar token único de 32 bytes y expira en 60 minutos
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiresDate = new Date(Date.now() + 60 * 60 * 1000);
        // Formatear para MySQL YYYY-MM-DD HH:MM:SS
        const expiresFormatted = expiresDate.toISOString().slice(0, 19).replace('T', ' ');

        // 3. Guardar token y fecha de expiración en la base de datos MySQL (futzone2)
        await pool.execute(
            "UPDATE usuarios SET reset_token = ?, reset_token_expires = ? WHERE LOWER(email) = ?",
            [resetToken, expiresFormatted, emailLimpio]
        );

        // 4. Configurar Nodemailer con Gmail SMTP
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_HOST_USER || "joaquiduvan61@gmail.com",
                pass: process.env.EMAIL_HOST_PASSWORD || "xguwmucosbljmsig",
            },
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

        // 5. Enviar Correo Dinámico al destinatario (to: emailLimpio)
        await transporter.sendMail({
            from: `FutZone <${process.env.EMAIL_HOST_USER || "joaquiduvan61@gmail.com"}>`,
            to: emailLimpio, // 👈 Correo dinámico del usuario
            subject: "⚽ Restablece tu contraseña - FutZone",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090d16; padding: 25px; border-radius: 20px; border: 1px solid #1e293b;">
                    <div style="background-color: #16a34a; padding: 24px; text-align: center; border-radius: 14px 14px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 3px;">
                            FUT<span style="color: #dcfce7;">ZONE</span>
                        </h1>
                    </div>
                    <div style="background-color: #0f172a; padding: 30px; border-radius: 0 0 14px 14px; color: #f8fafc;">
                        <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">¡Hola, ${usuario.nombre_completo || "Jugador"}!</h2>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>FutZone</strong>.
                        </p>
                        <p style="font-size: 15px; color: #94a3b8; line-height: 1.6;">
                            Haz clic en el siguiente botón para definir tu nueva contraseña. Este enlace expira en <strong>60 minutos</strong>:
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${resetUrl}" style="background-color: #16a34a; color: #ffffff; padding: 15px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(22, 163, 74, 0.3);">
                                Restablecer Contraseña
                            </a>
                        </div>
                        <p style="font-size: 13px; color: #64748b; line-height: 1.4;">
                            Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá estando protegida.
                        </p>
                        <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #475569; text-align: center;">
                            FutZone — Sistema de Gestión Deportiva de Popayán
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
        console.error("Error en solicitar recuperación:", error);
        return NextResponse.json(
            { message: error.message || "Error interno del servidor al procesar el correo." },
            { status: 500 }
        );
    }
}