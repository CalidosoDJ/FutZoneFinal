import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function POST(request) {
    try {
        const { id_rol, nombre_completo, username, email, password, telefono, categoria_arbitro } = await request.json();

        if (!id_rol || !nombre_completo || !email || !password) {
            return NextResponse.json(
                { message: 'El rol, nombre completo, correo y contraseña son obligatorios.' },
                { status: 400 }
            );
        }

        // 1. Insertar el usuario con el id_rol seleccionado (1: Admin, 2: Jugador, 3: Árbitro)
        const [result] = await pool.execute(
            `INSERT INTO usuarios (id_rol, nombre_completo, username, email, password_hash, telefono) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                Number(id_rol),
                nombre_completo,
                username || email.split('@')[0],
                email,
                password,
                telefono || null,
            ]
        );

        const nuevoIdUsuario = result.insertId;

        // 2. Si el Admin eligió crear un Árbitro (id_rol = 3), creamos automáticamente su perfil deportivo
        if (Number(id_rol) === 3) {
            await pool.execute(
                `INSERT INTO perfil_arbitro (id_usuario, categoria) VALUES (?, ?)`,
                [nuevoIdUsuario, categoria_arbitro || 'Árbitro Local']
            );
        }

        return NextResponse.json(
            { message: 'Usuario creado exitosamente por el Administrador.', id_usuario: nuevoIdUsuario },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error al crear usuario desde Admin:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { message: 'El correo electrónico o el nombre de usuario ya existen.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Error interno del servidor al crear usuario.' },
            { status: 500 }
        );
    }
}