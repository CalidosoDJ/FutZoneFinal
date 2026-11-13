import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  Trophy,
  CalendarDays,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  const anio = new Date().getFullYear();

  const enlaces = [
    { nombre: "Inicio", href: "/?omitirSplash=true" },
    { nombre: "Lista de canchas", href: "/canchas" },
    { nombre: "Mis reservas", href: "/mis-reservas" },
    { nombre: "Torneos", href: "/torneos" },
    { nombre: "Mi perfil", href: "/perfil" },
    { nombre: "Sobre Nosotros", href: "/nosotros" },
  ];

  const servicios = [
    {
      icono: MapPin,
      titulo: "Encuentra tu cancha",
      href: "/canchas",
    },
    {
      icono: CalendarDays,
      titulo: "Gestiona tus reservas",
      href: "/mis-reservas",
    },
    {
      icono: Trophy,
      titulo: "Vive los torneos",
      href: "/torneos",
    },
  ];

  const redes = [
    {
      nombre: "Facebook",
      imagen: "/icons/facebook.png",
      href: "https://www.facebook.com/",
      color: "hover:bg-blue-600",
    },
    {
      nombre: "Instagram",
      imagen: "/icons/instagram.png",
      href: "https://www.instagram.com/",
      color: "hover:bg-pink-600",
    },
    {
      nombre: "WhatsApp",
      icono: MessageCircle,
      href: "https://wa.me/",
      color: "hover:bg-green-600",
    },
  ];

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-green-400/20 bg-[#070b08] text-white">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-green-400 to-transparent" />

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-500/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-emerald-400/[0.05] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:gap-10 lg:py-16">
          {/* MARCA */}
          <div>
            <Link
              href="/?omitirSplash=true"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-400/30 bg-green-400/10 p-1 transition duration-300 group-hover:border-green-400/70">
                <Image
                  src="/icons/futzone logo.jpeg"
                  alt="Logo FutZone"
                  width={48}
                  height={48}
                  className="h-full w-full rounded-xl object-contain"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black uppercase italic tracking-tight">
                  FUT<span className="text-green-400">ZONE</span>
                </h2>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">
                  Tu pasión, tu cancha
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Conectamos tu pasión por el fútbol con las mejores canchas para
              jugar. Encuentra tu cancha, organiza tus encuentros y disfruta
              cada partido.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/[0.07] px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-xs font-bold text-green-300">
                La pasión nunca se detiene
              </span>
            </div>
          </div>

          {/* NAVEGACIÓN */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
              <span className="h-5 w-1 rounded-full bg-green-400" />
              Navegación
            </h3>

            <ul className="mt-6 space-y-4">
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-green-300"
                  >
                    <ChevronRight
                      size={15}
                      className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-green-400"
                    />
                    {enlace.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICIOS */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
              <span className="h-5 w-1 rounded-full bg-green-400" />
              Vive FutZone
            </h3>

            <div className="mt-6 space-y-3">
              {servicios.map((servicio) => {
                const Icono = servicio.icono;

                return (
                  <Link
                    key={servicio.href}
                    href={servicio.href}
                    className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition duration-200 hover:border-green-400/20 hover:bg-green-400/[0.06]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-400/10 text-green-400 transition group-hover:bg-green-400 group-hover:text-black">
                      <Icono size={19} />
                    </div>

                    <span className="flex-1 text-xs font-bold text-gray-300 transition group-hover:text-white">
                      {servicio.titulo}
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="text-gray-600 transition group-hover:text-green-400"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* REDES Y CONTACTO */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
              <span className="h-5 w-1 rounded-full bg-green-400" />
              Conecta con nosotros
            </h3>

            <p className="mt-6 text-sm leading-6 text-gray-400">
              Sigue nuestra comunidad y mantente al día con las novedades de
              FutZone.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {redes.map((red) => {
                const Icono = red.icono;

                return (
                  <a
                    key={red.nombre}
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={red.nombre}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all ${red.color}`}
                  >
                    {red.imagen ? (
                      <Image
                        src={red.imagen}
                        alt={red.nombre}
                        width={22}
                        height={22}
                        className="object-contain"
                      />
                    ) : (
                      <Icono size={20} />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl border border-green-400/15 bg-gradient-to-br from-green-400/[0.09] to-transparent p-4">
              <div className="flex items-center gap-2 text-green-300">
                <ShieldCheck size={19} />
                <span className="text-xs font-black uppercase tracking-wide">
                  Tu experiencia deportiva
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                Explora, elige tu cancha y prepárate para jugar.
              </p>

              <Link
                href="/canchas"
                className="mt-4 inline-flex items-center gap-2 text-xs font-black text-green-400 transition hover:text-green-300"
              >
                EXPLORAR CANCHAS
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR */}
        <div className="flex flex-col gap-4 border-t border-white/[0.08] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-xs text-gray-500 sm:text-left">
            © {anio} <span className="font-black text-gray-300">FutZone</span>.
            Todos los derechos reservados.
          </p>

          <p className="text-center text-xs text-gray-500">
            Hecho para los amantes del fútbol
          </p>
        </div>
      </div>
    </footer>
  );
}
