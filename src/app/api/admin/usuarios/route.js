import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function GET() {
    try {
        const [rows] = await pool.execute(
            `SELECT u.id_usuario, u.nombre_completo, u.username, u.email, u.telefono, u.id_rol, r.nombre AS rol 
       FROM usuarios u
       INNER JOIN roles r ON u.id_rol = r.id_rol
       ORDER BY u.id_usuario DESC`
        );

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}