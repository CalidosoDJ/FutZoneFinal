
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
                const [respuestaCanchas, respuestaSedes] =
                    await Promise.all([
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
                        (item) =>
                            Number(item.id_sede) === Number(cancha.id_sede)
                    );

                    const rutaImagen = cancha.imagen_url;

                    const imagen = rutaImagen
                        ? rutaImagen.startsWith("http")
                            ? rutaImagen
                            : `${API}/media/${rutaImagen
                                  .replace(/^\/?media\//, "")
                                  .replace(/^\//, "")}`
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

    const limpiarFiltros = () => {
        setBuscar("");
        setPrecio("ninguno");
        setZona("todas");
    };

    return (
        <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-800">

            {/* PORTADA */}
            <section className="relative isolate overflow-hidden border-b border-green-100">
                <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_30%,rgba(34,197,94,0.18),transparent_45%),linear-gradient(120deg,#ffffff_0%,#f0fdf4_50%,#dcfce7_100%)]" />

                <div className="absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full border border-green-500/15 md:h-[500px] md:w-[500px]" />
                <div className="absolute -right-12 top-24 -z-10 h-64 w-64 rounded-full border border-green-500/15 md:h-[400px] md:w-[400px]" />

                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:min-h-[470px] md:grid-cols-[1.2fr_0.8fr] md:py-24">

                    <div>
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-green-700 shadow-sm">
                            <Zap size={15} />
                            Tu próximo partido empieza aquí
                        </div>

                        <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.98] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                            La cancha
                            <br />
                            <span className="text-green-600">te espera.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                            Reúne a tu equipo, elige tu escenario y demuestra
                            quién manda en el terreno de juego.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#canchas"
                                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-black text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-1 hover:bg-green-700"
                            >
                                EXPLORAR CANCHAS
                                <ArrowUpRight size={19} />
                            </a>

                            <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-white/90 px-5 py-3 shadow-sm">
                                <Trophy className="text-green-600" size={24} />
                                <div>
                                    <p className="text-lg font-black text-slate-900">
                                        {canchas.length}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Canchas registradas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA DEPORTIVA */}
                    <div className="relative hidden md:block">
                        <div className="absolute -inset-5 rounded-[2rem] bg-green-400/20 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white p-6 shadow-xl shadow-green-900/5">

                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
                                    Match day
                                </span>

                                <span className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                                    MODO FUTZONE
                                </span>
                            </div>

                            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-green-200 bg-[linear-gradient(145deg,#86efac,#4ade80_55%,#16a34a)]">

                                <div className="absolute inset-4 rounded-xl border-2 border-white/70" />
                                <div className="absolute left-1/2 top-4 bottom-4 border-l-2 border-white/70" />
                                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
                                <div className="absolute left-4 top-1/2 h-20 w-12 -translate-y-1/2 border-2 border-white/70" />
                                <div className="absolute right-4 top-1/2 h-20 w-12 -translate-y-1/2 border-2 border-white/70" />

                                <div className="relative z-10 text-center">
                                    <Trophy
                                        size={62}
                                        className="mx-auto text-white drop-shadow-lg"
                                    />

                                    <p className="mt-4 text-3xl font-black uppercase italic tracking-tight text-white drop-shadow">
                                        Juega en grande
                                    </p>

                                    <p className="mt-2 text-sm font-medium text-white/90">
                                        Tu equipo. Tu cancha. Tu historia.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <ShieldCheck className="mb-2 text-green-600" size={22} />
                                    <p className="font-bold text-slate-800">
                                        Elige tu cancha
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Explora las opciones disponibles
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                                    <CalendarDays className="mb-2 text-green-600" size={22} />
                                    <p className="font-bold text-slate-800">
                                        Arma el partido
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
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
                <div className="-mt-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6 md:-mt-8">

                    <div className="mb-5 flex items-center gap-3">
                        <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                            <SlidersHorizontal size={21} />
                        </div>

                        <div>
                            <h2 className="font-black uppercase tracking-wide text-slate-900">
                                Encuentra tu próximo escenario
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Busca y ordena las canchas a tu manera.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">

                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                                size={20}
                            />

                            <input
                                type="search"
                                placeholder="Buscar por nombre de cancha..."
                                value={buscar}
                                onChange={(e) => setBuscar(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                        </div>

                        <div className="relative">
                            <MapPin
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                                size={19}
                            />

                            <select
                                value={zona}
                                onChange={(e) => setZona(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-11 py-4 text-slate-700 shadow-sm outline-none focus:border-green-500"
                            >
                                <option value="todas">Todas las canchas</option>
                            </select>
                        </div>

                        <select
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 shadow-sm outline-none focus:border-green-500"
                        >
                            <option value="ninguno">Ordenar por precio</option>
                            <option value="menor">Precio: menor a mayor</option>
                            <option value="mayor">Precio: mayor a menor</option>
                        </select>
                    </div>

                    {(buscar || precio !== "ninguno" || zona !== "todas") && (
                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="mt-4 text-sm font-bold text-green-600 transition hover:text-green-800"
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
                        <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-green-600">
                            Selecciona tu terreno
                        </p>

                        <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 sm:text-4xl">
                            Canchas{" "}
                            <span className="text-green-600">disponibles</span>
                        </h2>

                        <p className="mt-3 text-sm text-slate-500">
                            Encuentra el espacio perfecto para tu próximo partido.
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                        <span className="font-black text-green-600">
                            {cargando ? "..." : lista.length}
                        </span>{" "}
                        <span className="text-slate-500">
                            {lista.length === 1 ? "resultado" : "resultados"}
                        </span>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                        <h3 className="font-black text-red-700">
                            No pudimos cargar las canchas
                        </h3>

                        <p className="mt-2 text-sm text-red-600">{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 font-bold text-red-700 transition hover:bg-red-200"
                        >
                            <RefreshCw size={16} />
                            Intentar de nuevo
                        </button>
                    </div>
                )}

                {/* CARGANDO */}
                {cargando && !error && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <div className="h-56 bg-slate-100" />

                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                                    <div className="h-4 w-full rounded bg-slate-100" />
                                    <div className="h-10 w-1/2 rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CANCHAS */}
                {!cargando && !error && lista.length > 0 && (
                    <>
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                            <CircleDollarSign size={17} className="text-green-600" />
                            Precios por hora según la información registrada.
                        </div>

                        <div className="grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {lista.map((cancha) => (
                                <div
                                    key={cancha.id}
                                    className="group relative rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl hover:shadow-green-900/10"
                                >
                                    <div className="absolute right-4 top-4 z-10 rounded-full border border-green-200 bg-white/95 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-green-700 shadow-sm backdrop-blur">
                                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
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

                {/* SIN RESULTADOS */}
                {!cargando && !error && lista.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <Search size={30} />
                        </div>

                        <h3 className="mt-5 text-2xl font-black text-slate-900">
                            No encontramos canchas
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-slate-500">
                            Prueba con otro nombre o elimina los filtros para ver
                            todas las canchas registradas.
                        </p>

                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-black text-white transition hover:bg-green-700"
                        >
                            VER TODAS LAS CANCHAS
                        </button>
                    </div>
                )}
            </section>

            {/* CIERRE */}
            <section className="border-t border-green-100 bg-green-50">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center">

                    <div>
                        <p className="text-lg font-black uppercase tracking-widest text-slate-900">
                            FUT<span className="text-green-600">ZONE</span>
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            El fútbol se vive en la cancha.
                        </p>
                    </div>

                    <a
                        href="#canchas"
                        className="inline-flex items-center gap-2 text-sm font-bold text-green-700 transition hover:text-green-900"
                    >
                        Volver a las canchas
                        <ArrowUpRight size={17} />
                    </a>
                </div>
            </section>

        </main>
    );
}
