"use client";

import { usePathname } from "next/navigation";

import NavBarWrapper from "./publico/NavBarWrapper";
import ChatButton from "./publico/CHAT/ChatButton";

export default function LayoutWrapper({ children }) {

  const pathname = usePathname();

  // Verificar si estamos dentro del módulo de árbitro
  const esArbitro = pathname.startsWith("/arbitro");

  return (

    <>

      {!esArbitro && (
        <>
          <NavBarWrapper />
          <ChatButton />
        </>
      )}

      <main className="flex-1">
        {children}
      </main>

    </>

  );

}