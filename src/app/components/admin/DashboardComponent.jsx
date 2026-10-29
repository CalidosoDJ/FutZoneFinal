"use client";

import BienvenidaBanner from "./BienvenidaBanner";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import ActividadReciente from "./ActividadReciente";

export default function DashboardComponent() {

    return (

        <main className="bg-gray-100 min-h-screen text-gray-700">
            <BienvenidaBanner />
            <h1 className="text-4xl font-bold mb-8 text-gray-800">

                Dashboard

            </h1>

            <DashboardCards />

            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                <DashboardCharts />

                <ActividadReciente />

            </div>



        </main>

    );

}