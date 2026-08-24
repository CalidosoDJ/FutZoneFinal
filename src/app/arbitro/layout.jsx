"use client";

import { ArbitroProvider } from "../context/ArbitroContext";

export default function ArbitroLayout({ children }) {

  return (

    <ArbitroProvider>

      {children}

    </ArbitroProvider>

  );

}