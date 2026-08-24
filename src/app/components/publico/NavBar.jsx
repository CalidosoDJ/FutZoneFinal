import AuthButtons from "./AuthButtons";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {

  return (
    <nav className="bg-gray-950 text-white px-10 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">

      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer">

        <Image
          src="/icons/futzone logo.jpeg"
          alt="Logo FutZone"
          width={50}
          height={50}
          className="object-contain rounded-full"
        />

        <h1 className="text-3xl font-bold">
          Fut<span className="text-green-500">Zone</span>
        </h1>

      </div>

      {/* Menú */}
      <ul className="hidden md:flex items-center gap-10 text-lg font-medium">

        



      </ul>

      {/* Botones */}
      <AuthButtons />

    </nav>
  );
}