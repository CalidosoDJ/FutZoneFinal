"use client";

import dynamic from "next/dynamic";

const MapaComponent = dynamic(
  () => import("../components/publico/MapaComponent"),
  { ssr: false },
);

export default function MapaCliente() {
  return <MapaComponent />;
}
