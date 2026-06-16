"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapaComponent() {

    const posicion = [2.4582633126616122, -76.59864248453593];
    return (

        <MapContainer
            center={posicion}
            zoom={14}
            className="h-[555px] w-full rounded-3xl"
        >

            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[2.4582633126616122, -76.59864248453593]}
                eventHandlers={{
                    click: (e) => {
                        e.target._map.flyTo(
                            [2.4582633126616122, -76.59864248453593],
                            18,
                            {
                                duration: 1.5,
                            }
                        );
                    },
                }}>
                <Popup>
                    <div className="animate-pulse text-center">

                        <h3 className="font-bold text-lg text-green-700 mb-2">
                            FutZone⚽
                        </h3>

                        <p className="my-4">
                            Reserva tu cancha aquí
                        </p>

                        <Link href="/canchas">
                            <button className="bg-green-600 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition ">
                                Reservar
                            </button>
                        </Link>

                    </div>
                </Popup>
            </Marker>

        </MapContainer>

    );
}