"use client";

import dynamic from "next/dynamic";

const MapaCanchas = dynamic(() => import("../components/publico/MapaCanchas"), {
  ssr: false,
});

export default function MapaCliente() {
  return <MapaCanchas />;
}
