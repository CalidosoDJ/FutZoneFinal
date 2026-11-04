import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool(process.env.DATABASE_URL);

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // 1. Ver qué datos exactos están llegando desde el formulario del Frontend
        console.log("=== INTENTO DE LOGIN ===");
        console.log("Email recibido:", `"${email}"`);
        console.log("Password recibida:", `"${password}"`);

        if (!email || !password) {
            return NextResponse.json(
                { message: "El correo y la contraseña son requeridos." },
                { status: 400 }
            );
        }

        // 2. Buscar usuario en MySQL
        const [rows] = await pool.execute(
            "SELECT id_usuario, nombre_completo, email, password_hash, id_rol FROM usuarios WHERE email = ?",
            [email]
        );

        console.log("Filas encontradas en BD:", rows.length);

        if (rows.length === 0) {
            console.log("--> ERROR: No se encontró ningún usuario con ese correo.");
            return NextResponse.json(
                { message: "Correo o contraseña incorrectos." },
                { status: 401 }
            );
        }

        const usuario = rows[0];
        console.log("Password en BD:", `"${usuario.password_hash}"`);

        // 3. Validar contraseña
        let esValida = false;

        if (password === usuario.password_hash) {
            esValida = true;
        } else {
            try {
                esValida = await bcrypt.compare(password, usuario.password_hash);
            } catch (bcryptError) {
                esValida = false;
            }
        }

        console.log("¿Contraseña válida?:", esValida);

        if (!esValida) {
            console.log("--> ERROR: La contraseña no coincidió.");
            return NextResponse.json(
                { message: "Correo o contraseña incorrectos." },
                { status: 401 }
            );
        }

        console.log("--> LOGIN EXITOSO para id_usuario:", usuario.id_usuario);

        return NextResponse.json(
            {
                message: "Inicio de sesión exitoso.",
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre_completo: usuario.nombre_completo,
                    email: usuario.email,
                    id_rol: usuario.id_rol,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("--> ERROR EXCEPCIÓN EN LOGIN:", error);
        return NextResponse.json(
            { message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}