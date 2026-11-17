import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { message: "Token de Google no proporcionado" },
                { status: 400 }
            );
        }

        //Conectar Next.js directamente conla vista de Django (port 8000)
        const djangoRes = await fetch("http://127.0.0.1:8000/api/auth/google/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        const data = await djangoRes.json();

        if (!djangoRes.ok) {
            return NextResponse.json(
                { message: data.message || "Error al verificar credenciales en Django" },
                { status: djangoRes.status }
            );
        }

        // Retornar la respuesta de Django (con los datos del usuario en MySQL)
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Error conectando Next.js con Django:", error);
        return NextResponse.json(
            { message: "No se pudo conectar con el servidor backend de Django." },
            { status: 500 }
        );
    }
}