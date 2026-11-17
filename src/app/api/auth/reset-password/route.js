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

        const djangoUrl = process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/usuarios/reset-password/`
            : "http://127.0.0.1:8000/api/usuarios/reset-password/";

        // Reenvío seguro del token y contraseña hacia Django
        const respuestaDjango = await fetch(djangoUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token.trim(),
                newPassword: newPassword,
            }),
        });

        const data = await respuestaDjango.json();

        if (!respuestaDjango.ok) {
            return NextResponse.json(
                { message: data.message || "Error al restablecer la contraseña en Django." },
                { status: respuestaDjango.status }
            );
        }

        return NextResponse.json(
            { message: "Contraseña restablecida con éxito." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error exacto conectando con el backend de Django:", error);
        return NextResponse.json(
            { message: "No se pudo conectar con el servidor backend." },
            { status: 500 }
        );
    }
}