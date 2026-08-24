"use client";

import { useState } from "react";

export default function Preguntas() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "¿Cómo puedo reservar una cancha en FutZone?",
            answer:
                "Ingresa a la sección de reservas, selecciona la cancha, la fecha y la hora disponible.",
        },
        {
            question: "¿Cómo funcionan los convenios en FutZone?",
            answer:
                "Debes estar asociado a una entidad con convenio activo y presentar la información requerida.",
        },
        {
            question: "¿Puedo cancelar una reserva?",
            answer: "Sí. Puedes cancelar tus reservas desde tu perfil.",
        },
        {
            question: "¿Qué métodos de pago acepta FutZone?",
            answer:
                "Puedes pagar tus reservas mediante tarjeta de crédito, tarjeta débito, transferencias bancarias y otros medios habilitados en la plataforma.",
        },
        {
            question: "¿Puedo reservar una cancha para un torneo o evento especial?",
            answer:
                "Sí. FutZone permite realizar reservas para torneos, campeonatos y eventos deportivos, sujetas a disponibilidad.",
        },
        {
            question: "¿Cómo puedo consultar mis reservas activas?",
            answer:
                "Ingresa a tu perfil de usuario y dirígete a la sección 'Mis Reservas', donde podrás ver todas las reservas programadas.",
        },
        {
            question: "¿Qué sucede si llego tarde a mi reserva?",
            answer:
                "Se recomienda llegar con anticipación. Si llegas tarde, el tiempo perdido no podrá recuperarse y la reserva finalizará en el horario establecido.",
        },
    ];

    return (
        <section className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-4xl font-bold text-center text-green-600 mb-10">
                Preguntas Frecuentes
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
                    >
                        <button
                            onClick={() =>
                                setOpenIndex(openIndex === index ? null : index)
                            }
                            className="w-full flex justify-between items-center px-6 py-5 text-left hover:bg-gray-50 transition"
                        >
                            <span className="font-semibold text-gray-800">
                                {faq.question}
                            </span>

                            <span className="text-2xl font-bold text-green-600">
                                {openIndex === index ? "−" : "+"}
                            </span>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-5 border-t border-gray-200 text-gray-600">
                                <p className="pt-4">{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}