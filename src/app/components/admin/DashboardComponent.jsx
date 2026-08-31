"use client";

import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import ReservasRecientes from "./ReservasRecientes";
import ActividadReciente from "./ActividadReciente";

export default function DashboardComponent() {

    return (

        <main className="bg-gray-100 min-h-screen text-gray-700">

            <h1 className="text-4xl font-bold mb-8 text-gray-800">

                Dashboard

            </h1>

            <DashboardCards />

            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                <DashboardCharts />

                <ActividadReciente />

            </div>

            <div className="mt-8">

                <ReservasRecientes />

            </div>

        </main>

    );

}