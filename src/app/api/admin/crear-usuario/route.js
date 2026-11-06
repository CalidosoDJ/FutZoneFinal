import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

const pool = mysql.createPool(process.env.DATABASE_URL);

// Función para cifrar contraseña en formato compatible con Django (pbkdf2_sha256)
function hashPasswordDjango(password) {
    const iterations = 720000;
    const salt = crypto.randomBytes(12).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('base64');
    return `pbkdf2_sha256$${iterations}$${salt}$${hash}`;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { id_rol, nombre_completo, username, email, password, telefono } = body;

        if (!id_rol || !nombre_completo || !email || !password) {
            return NextResponse.json(
                { message: 'El rol, nombre completo, correo y contraseña son obligatorios.' },
                { status: 400 }
            );
        }

        // Cifrado de contraseña
        const passwordHash = hashPasswordDjango(password);
        const usernameFinal = username ? username.trim() : email.split('@')[0];

        // 🟢 Inserción ajustada con estado 'activo' compatible con ENUM
        const [result] = await pool.execute(
            `INSERT INTO usuarios (id_rol, nombre_completo, username, email, password_hash, telefono, estado) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                Number(id_rol),
                nombre_completo.trim(),
                usernameFinal,
                email.trim(),
                passwordHash,
                telefono ? telefono.trim() : null,
                'activo' // 👈 ENUM exacto de MySQL
            ]
        );

        return NextResponse.json(
            { message: 'Usuario creado exitosamente por el Administrador.', id_usuario: result.insertId },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error al crear usuario desde Admin:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { message: 'El correo electrónico o el nombre de usuario ya se encuentran registrados.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: `Error en la base de datos: ${error.message || 'Error interno'}` },
            { status: 500 }
        );
    }
}