import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { message: "El token y la nueva contraseña son obligatorios." },
                { status: 400 }
            );
        }

        // Usamos http://localhost:8000
        const respuestaDjango = await fetch("http://localhost:8000/api/usuarios/reset-password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                newPassword: newPassword,
            }),
        });

        const data = await respuestaDjango.json();

        if (!respuestaDjango.ok) {
            return NextResponse.json(
                { message: data.message || "Error al procesar en Django." },
                { status: respuestaDjango.status }
            );
        }

        return NextResponse.json(
            { message: "Contraseña restablecida con éxito." },
            { status: 200 }
        );
    } catch (error) {
        // Imprime el error exacto en la terminal de VS Code donde corre Next.js
        console.error("Error exacto conectando con Django:", error);
        return NextResponse.json(
            { message: "No se pudo conectar con el servidor Django." },
            { status: 500 }
        );
    }
}