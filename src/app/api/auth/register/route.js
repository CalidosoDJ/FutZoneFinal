import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function POST(request) {
    try {
        const { nombre_completo, username, email, password, telefono } = await request.json();

        if (!nombre_completo || !email || !password) {
            return NextResponse.json(
                { message: 'El nombre completo, correo y contraseña son obligatorios.' },
                { status: 400 }
            );
        }

        // 🔒 REGLA DE SEGURIDAD: Todo registro público es Jugador (Rol 2)
        const ID_ROL_JUGADOR = 2;

        const [result] = await pool.execute(
            `INSERT INTO usuarios (id_rol, nombre_completo, username, email, password_hash, telefono) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                ID_ROL_JUGADOR,
                nombre_completo,
                username || email.split('@')[0], // Si no envía username, se genera con el correo
                email,
                password, // Almacena el hash o clave de prueba
                telefono || null,
            ]
        );

        return NextResponse.json(
            {
                message: '¡Registro exitoso! Ya puedes iniciar sesión como Jugador.',
                id_usuario: result.insertId,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error en registro:', error);

        // Manejar duplicados (correo o username ya registrados)
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { message: 'El correo electrónico o nombre de usuario ya se encuentra registrado.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Error interno del servidor al procesar el registro.' },
            { status: 500 }
        );
    }
}