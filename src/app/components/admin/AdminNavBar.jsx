"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export default function AdminNavbar() {

    return (

        <header className="h-20 bg-white shadow flex items-center justify-between px-8 text-gray-700">

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-4 top-3 text-gray-500"
                />

                <input
                    type="text"
                    placeholder="Buscar..."
                    className="pl-11 pr-4 py-2 border rounded-xl outline-none w-80"
                />

            </div>

            <div className="flex items-center gap-6">

                <Bell className="cursor-pointer"/>

                <div className="flex items-center gap-3">

                    <UserCircle size={40}/>

                    <div>

                        <h3 className="font-semibold">
                            Administrador
                        </h3>

                        <p className="text-gray-500 text-sm">
                            FutZone
                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}