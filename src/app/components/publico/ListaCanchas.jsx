
"use client";

import { useState, useEffect } from "react";
import {
    Search,
    MapPin,
    SlidersHorizontal,
    Zap,
    Trophy,
    ArrowUpRight,
    CircleDollarSign,
    ShieldCheck,
    RefreshCw,
    CalendarDays,
} from "lucide-react";
import CardCancha from "./CardCancha";

const API = "http://127.0.0.1:8000";

export default function ListaCanchas() {
    const [buscar, setBuscar] = useState("");
    const [zona, setZona] = useState("todas");
    const [precio, setPrecio] = useState("ninguno");
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function cargarCanchas() {
            setCargando(true);
            setError("");

            try {
                const [respuestaCanchas, respuestaSedes] = await Promise.all([
                    fetch(`${API}/api/canchas/`),
                    fetch(`${API}/api/sedes/`),
                ]);

                if (!respuestaCanchas.ok || !respuestaSedes.ok) {
                    throw new Error("No se pudieron cargar los datos.");
                }

                const [datosCanchas, sedes] = await Promise.all([
                    respuestaCanchas.json(),
                    respuestaSedes.json(),
                ]);

                if (!activo) return;

                const listaCanchas = datosCanchas.map((cancha) => {
                    const sede = sedes.find(
                        (item) => Number(item.id_sede) === Number(cancha.id_sede)
                    );

                    const rutaImagen = cancha.imagen_url;
                    const imagen = rutaImagen
                        ? rutaImagen.startsWith("http")
                            ? rutaImagen
                            : `${API}/media/${rutaImagen.replace(/^\/?media\//, "").replace(/^\//, "")}`
                        : "/images/cancha1.jpg";

                    return {
                        id: cancha.id_cancha,
                        nombre: cancha.nombre || "Cancha FutZone",
                        zona: "todas",
                        tipo: "Cancha sintética",
                        direccion: sede
                            ? [sede.direccion, sede.ciudad, sede.departamento]
                                .filter(Boolean)
                                .join(", ")
                            : "Ubicación no disponible",
                        telefono: sede?.telefono || "",
                        precio: Number(cancha.precio_hora) || 0,
                        imagen,
                        estado: cancha.estado,
                        id_sede: cancha.id_sede,
                        id_tipo: cancha.id_tipo,
                    };
                });

                setCanchas(listaCanchas);
            } catch (err) {
                console.error("Error cargando canchas y sedes:", err);

                if (activo) {
                    setError(
                        "No pudimos conectar con las canchas. Verifica que el servidor Django esté funcionando."
                    );
                }
            } finally {
                if (activo) setCargando(false);
            }
        }

        cargarCanchas();

        return () => {
            activo = false;
        };
    }, []);

    const canchasDisponibles = canchas.filter((cancha) => {
        const coincideNombre = cancha.nombre
            .toLowerCase()
            .includes(buscar.trim().toLowerCase());

        const coincideZona = zona === "todas" || cancha.zona === zona;

        return coincideNombre && coincideZona;
    });

    const lista = [...canchasDisponibles].sort((a, b) => {
        if (precio === "menor") return a.precio - b.precio;
        if (precio === "mayor") return b.precio - a.precio;
        return 0;
    });

    const formatoPrecio = (valor) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(valor);

    return (
        <main className="min-h-screen overflow-hidden bg-[#080d0b] text-white">
            {/* PORTADA */}
            <section className="relative isolate overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_30%,rgba(34,197,94,0.20),transparent_45%),linear-gradient(120deg,#07110b_0%,#101b14_50%,#080d0b_100%)]" />

                <div className="absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full border border-green-400/10 md:h-[500px] md:w-[500px]" />
                <div className="absolute -right-12 top-24 -z-10 h-64 w-64 rounded-full border border-green-400/10 md:h-[400px] md:w-[400px]" />

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:min-h-[470px] md:grid-cols-[1.2fr_0.8fr] md:py-24">
                    <div>
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-green-300">
                            <Zap size={15} />
                            Tu próximo partido empieza aquí
                        </div>

                        <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                            La cancha
                            <br />
                            <span className="text-green-400">te espera.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
                            Reúne a tu equipo, elige tu escenario y demuestra
                            quién manda en el terreno de juego.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#canchas"
                                className="inline-flex items-center gap-2 rounded-xl bg-green-400 px-6 py-4 font-black text-black shadow-lg shadow-green-500/20 transition hover:-translate-y-1 hover:bg-green-300"
                            >
                                EXPLORAR CANCHAS
                                <ArrowUpRight size={19} />
                            </a>

                            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
                                <Trophy className="text-green-400" size={24} />
                                <div>
                                    <p className="text-lg font-black">
                                        {canchas.length}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Canchas registradas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden md:block">
                        <div className="absolute -inset-5 rounded-[2rem] bg-green-400/10 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-green-400/20 bg-[#101a13] p-6 shadow-2xl">
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-green-300">
                                    Match day
                                </span>
                                <span className="flex items-center gap-2 text-xs text-gray-400">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                                    MODO FUTZONE
                                </span>
                            </div>

                            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-green-400/20 bg-[linear-gradient(145deg,#183e27,#0c2415_55%,#07140c)]">
                                <div className="absolute inset-4 rounded-xl border-2 border-white/20" />
                                <div className="absolute left-1/2 top-4 bottom-4 border-l-2 border-white/20" />
                                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/20" />
                                <div className="absolute left-4 top-1/2 h-20 w-12 -translate-y-1/2 border-2 border-white/20" />
                                <div className="absolute right-4 top-1/2 h-20 w-12 -translate-y-1/2 border-2 border-white/20" />

                                <div className="relative z-10 text-center">
                                    <Trophy
                                        size={62}
                                        className="mx-auto text-green-300 drop-shadow-[0_0_25px_rgba(74,222,128,0.55)]"
                                    />
                                    <p className="mt-4 text-3xl font-black uppercase italic tracking-tight">
                                        Juega en grande
                                    </p>
                                    <p className="mt-2 text-sm text-green-100/70">
                                        Tu equipo. Tu cancha. Tu historia.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                    <ShieldCheck className="mb-2 text-green-400" size={22} />
                                    <p className="font-bold">Elige tu cancha</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Explora las opciones disponibles
                                    </p>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                                    <CalendarDays className="mb-2 text-green-400" size={22} />
                                    <p className="font-bold">Arma el partido</p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Prepárate para jugar
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BUSCADOR Y FILTROS */}
            <section className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
                <div className="-mt-1 rounded-2xl border border-white/10 bg-[#111813] p-4 shadow-2xl sm:p-6 md:-mt-8">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-green-400/10 p-2.5 text-green-400">
                            <SlidersHorizontal size={21} />
                        </div>
                        <div>
                            <h2 className="font-black uppercase tracking-wide">
                                Encuentra tu próximo escenario
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Busca y ordena las canchas a tu manera.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                                size={20}
                            />
                            <input
                                type="search"
                                placeholder="Buscar por nombre de cancha..."
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#080d0b] py-4 pl-12 pr-4 text-white outline-none transition placeholder:text-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/10"
                            />
                        </div>

                        <div className="relative">
                            <MapPin
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                                size={19}
                            />
                            <select
                                value={zona}
                                onChange={(e) => setZona(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-white/10 bg-[#080d0b] px-11 py-4 text-white outline-none focus:border-green-400"
                            >
                                <option value="todas">Todas las canchas</option>
                            </select>
                        </div>

                        <select
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#080d0b] px-4 py-4 text-white outline-none focus:border-green-400"
                        >
                            <option value="ninguno">Ordenar por precio</option>
                            <option value="menor">Precio: menor a mayor</option>
                            <option value="mayor">Precio: mayor a menor</option>
                        </select>
                    </div>

                    {(buscar || precio !== "ninguno") && (
                        <button
                            type="button"
                            onClick={() => {
                                setBuscar("");
                                setPrecio("ninguno");
                                setZona("todas");
                            }}
                            className="mt-4 text-sm font-bold text-green-400 transition hover:text-green-300"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </section>

            {/* LISTADO */}
            <section
                id="canchas"
                className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20"
            >
                <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-green-400">
                            Selecciona tu terreno
                        </p>

                        <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
                            Canchas <span className="text-green-400">disponibles</span>
                        </h2>

                        <p className="mt-3 text-sm text-gray-400">
                            Encuentra el espacio perfecto para tu próximo partido.
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                        <span className="font-black text-green-400">
                            {cargando ? "..." : lista.length}
                        </span>{" "}
                        <span className="text-gray-400">
                            {lista.length === 1 ? "resultado" : "resultados"}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                        <h3 className="font-black text-red-300">
                            No pudimos cargar las canchas
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500/15 px-4 py-2 font-bold text-red-200 transition hover:bg-red-500/25"
                        >
                            <RefreshCw size={16} />
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                {cargando && !error && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-[#111813]"
                            >
                                <div className="h-56 bg-white/5" />
                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-2/3 rounded bg-white/10" />
                                    <div className="h-4 w-full rounded bg-white/5" />
                                    <div className="h-10 w-1/2 rounded bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!cargando && !error && lista.length > 0 && (
                    <>
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
                            <CircleDollarSign size={17} className="text-green-400" />
                            Precios por hora según la información registrada.
                        </div>

                        <div className="grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {lista.map((cancha) => (
                                <div
                                    key={cancha.id}
                                    className="group relative rounded-2xl border border-white/10 bg-[#111813] p-2 transition duration-300 hover:-translate-y-1 hover:border-green-400/50 hover:shadow-[0_20px_60px_-25px_rgba(34,197,94,0.25)]"
                                >
                                    <div className="absolute right-4 top-4 z-10 rounded-full border border-green-400/30 bg-black/70 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-green-300 backdrop-blur">
                                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                                        FutZone
                                    </div>

                                    <CardCancha
                                        cancha={{
                                            ...cancha,
                                            precioFormateado: formatoPrecio(cancha.precio),
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!cargando && !error && lista.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-[#111813] px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-400/10 text-green-400">
                            <Search size={30} />
                        </div>

                        <h3 className="mt-5 text-2xl font-black">
                            No encontramos canchas
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-gray-400">
                            Prueba con otro nombre o elimina los filtros para ver
                            todas las canchas registradas.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setBuscar("");
                                setPrecio("ninguno");
                                setZona("todas");
                            }}
                            className="mt-6 rounded-xl bg-green-400 px-6 py-3 font-black text-black transition hover:bg-green-300"
                        >
                            VER TODAS LAS CANCHAS
                        </button>
                    </div>
                )}
            </section>

            {/* CIERRE */}
            <section className="border-t border-white/10 bg-[#0d140f]">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center">
                    <div>
                        <p className="text-lg font-black uppercase tracking-widest">
                            FUT<span className="text-green-400">ZONE</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            El fútbol se vive en la cancha.
                        </p>
                    </div>

                    <a
                        href="#canchas"
                        className="inline-flex items-center gap-2 text-sm font-bold text-green-400 transition hover:text-green-300"
                    >
                        Volver a las canchas
                        <ArrowUpRight size={17} />
                    </a>
                </div>
            </section>
        </main>
    );
}
