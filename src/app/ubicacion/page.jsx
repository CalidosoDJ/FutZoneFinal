"use client";

import MapaComponent from "@/app/components/publico/MapaComponent";

export default function UbicacionPage() {

    return (
        <div className="relative">

            {/* Logo flotante */}
            <div className="absolute top-3 left-13 z-[1000] bg-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                <img
                    src="/icons/futzone logo.jpeg"
                    alt="FutZone"
                    className="w-12 h-12"
                />

                <div>
                    <h3 className="font-bold text-green-700">
                        FutZone
                    </h3>

                    <p className="text-sm text-gray-500">
                        Complejo Deportivo
                    </p>
                </div>
            </div>

            <MapaComponent />

        </div>
    );
}