
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import {
    FaFutbol,
    FaCalendarCheck,
    FaTrophy,
    FaUsers,
    FaMoneyBillWave,
    FaBullhorn,
    FaFilePdf,
    FaBuilding,
    FaCreditCard,
    FaNewspaper,
    FaSyncAlt,
    FaChartLine,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaExclamationTriangle,
} from "react-icons/fa";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

// --------------------------------------------------
// CONFIGURACIÓN
// --------------------------------------------------

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const ENDPOINTS = {
    reservas: "/api/reservas/",
    pagos: "/api/pagos/",
    canchas: "/api/canchas/",
    sedes: "/api/sedes/",
    usuarios: "/api/usuarios/",
    publicaciones: "/api/publicaciones/",
    torneos: "/api/torneos/",
    promociones: "/api/promociones/",
};

const COLORES = {
    verde: "#16a34a",
    azul: "#2563eb",
    amarillo: "#eab308",
    rojo: "#dc2626",
    morado: "#9333ea",
    naranja: "#ea580c",
    gris: "#64748b",
};

const FORMATO_PESO = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

// --------------------------------------------------
// FUNCIONES AUXILIARES
// --------------------------------------------------

function obtenerLista(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    return [];
}

function obtenerEstado(item) {
    return String(item?.estado || item?.status || "")
        .trim()
        .toLowerCase();
}

function obtenerValor(item) {
    return Number(
        item?.total ??
        item?.valor ??
        item?.precio ??
        item?.monto ??
        item?.valor_total ??
        0
    ) || 0;
}

function obtenerFecha(item) {
    return (
        item?.fecha_reserva ||
        item?.fecha ||
        item?.fecha_inicio ||
        item?.created_at ||
        item?.fecha_creacion ||
        ""
    );
}

function obtenerNombreCancha(item) {
    const cancha = item?.id_cancha;

    if (typeof cancha === "object" && cancha !== null) {
        return (
            cancha.nombre ||
            cancha.nombre_cancha ||
            cancha.nombre_comercial ||
            "Cancha sin nombre"
        );
    }

    return (
        item?.cancha ||
        item?.nombreCancha ||
        item?.nombre_cancha ||
        "Cancha sin nombre"
    );
}

function obtenerNombreUsuario(item) {
    const usuario = item?.id_usuario;

    if (typeof usuario === "object" && usuario !== null) {
        return (
            usuario.nombre_completo ||
            usuario.username ||
            usuario.nombre ||
            "Usuario"
        );
    }

    return (
        item?.usuario ||
        item?.nombreUsuario ||
        item?.nombre_usuario ||
        "Usuario"
    );
}

function obtenerHora(item) {
    return (
        item?.hora_inicio ||
        item?.hora ||
        item?.hora_reserva ||
        "-"
    );
}

function esEstado(item, estado) {
    return obtenerEstado(item) === estado.toLowerCase();
}

function formatearFecha(fecha) {
    if (!fecha) return "-";

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return String(fecha);

    return valor.toLocaleDateString("es-CO");
}

function nombreMes(fecha) {
    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) return "Sin fecha";

    return valor.toLocaleDateString("es-CO", {
        month: "short",
        year: "2-digit",
    });
}

// --------------------------------------------------
// COMPONENTE PRINCIPAL
// --------------------------------------------------

export default function ReportesComponent() {
    const [datos, setDatos] = useState({
        reservas: [],
        pagos: [],
        canchas: [],
        sedes: [],
        usuarios: [],
        publicaciones: [],
        torneos: [],
        promociones: [],
    });

    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(true);
    const [actualizado, setActualizado] = useState(null);

    // --------------------------------------------------
    // CONSUMO DEL BACKEND
    // --------------------------------------------------

    const cargarReportes = useCallback(async () => {
        setCargando(true);

        const resultados = {};
        const nuevosErrores = {};

        const peticiones = Object.entries(ENDPOINTS).map(
            async ([nombre, endpoint]) => {
                try {
                    const respuesta = await fetch(
                        `${API_URL}${endpoint}`,
                        {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                            },
                            cache: "no-store",
                        }
                    );

                    if (!respuesta.ok) {
                        throw new Error(
                            `Error ${respuesta.status}`
                        );
                    }

                    const contenido = await respuesta.json();

                    resultados[nombre] = obtenerLista(contenido);
                } catch (error) {
                    resultados[nombre] = [];
                    nuevosErrores[nombre] = error.message;
                }
            }
        );

        await Promise.all(peticiones);

        setDatos({
            reservas: resultados.reservas || [],
            pagos: resultados.pagos || [],
            canchas: resultados.canchas || [],
            sedes: resultados.sedes || [],
            usuarios: resultados.usuarios || [],
            publicaciones: resultados.publicaciones || [],
            torneos: resultados.torneos || [],
            promociones: resultados.promociones || [],
        });

        setErrores(nuevosErrores);
        setActualizado(new Date());
        setCargando(false);
    }, []);

    useEffect(() => {
        cargarReportes();
    }, [cargarReportes]);

    // --------------------------------------------------
    // DATOS
    // --------------------------------------------------

    const {
        reservas,
        pagos,
        canchas,
        sedes,
        usuarios,
        publicaciones,
        torneos,
        promociones,
    } = datos;

    const reservasConfirmadas = useMemo(
        () => reservas.filter((r) =>
            esEstado(r, "Confirmada")
        ),
        [reservas]
    );

    const reservasPendientes = useMemo(
        () => reservas.filter((r) =>
            esEstado(r, "Pendiente")
        ),
        [reservas]
    );

    const reservasCanceladas = useMemo(
        () => reservas.filter((r) =>
            esEstado(r, "Cancelada")
        ),
        [reservas]
    );

    const torneosActivos = torneos.filter(
        (t) => esEstado(t, "Activo")
    ).length;

    const totalEquipos = torneos.reduce(
        (total, torneo) =>
            total +
            (Array.isArray(torneo.equipos)
                ? torneo.equipos.length
                : Number(torneo.total_equipos || 0)),
        0
    );

    // Ingresos estimados a partir de reservas confirmadas.
    // No equivale necesariamente a pagos efectivamente recibidos.

    const ingresosConfirmados = reservasConfirmadas.reduce(
        (total, reserva) => total + obtenerValor(reserva),
        0
    );

    const totalReservas = reservas.length;

    const tasaConfirmacion = totalReservas
        ? Math.round(
            (reservasConfirmadas.length / totalReservas) * 100
        )
        : 0;

    const tasaCancelacion = totalReservas
        ? Math.round(
            (reservasCanceladas.length / totalReservas) * 100
        )
        : 0;

    // --------------------------------------------------
    // GRÁFICAS
    // --------------------------------------------------

    const datosEstados = [
        {
            estado: "Confirmadas",
            cantidad: reservasConfirmadas.length,
            color: COLORES.verde,
        },
        {
            estado: "Pendientes",
            cantidad: reservasPendientes.length,
            color: COLORES.amarillo,
        },
        {
            estado: "Canceladas",
            cantidad: reservasCanceladas.length,
            color: COLORES.rojo,
        },
    ];

    const datosTorneos = [
        {
            estado: "Activos",
            cantidad: torneos.filter(
                (t) => esEstado(t, "Activo")
            ).length,
        },
        {
            estado: "En curso",
            cantidad: torneos.filter(
                (t) => esEstado(t, "En curso")
            ).length,
        },
        {
            estado: "Finalizados",
            cantidad: torneos.filter(
                (t) => esEstado(t, "Finalizado")
            ).length,
        },
    ];

    const datosIngresos = useMemo(() => {
        const agrupados = {};

        reservasConfirmadas.forEach((reserva) => {
            const fecha = obtenerFecha(reserva);

            if (!fecha) return;

            const mes = nombreMes(fecha);

            agrupados[mes] =
                (agrupados[mes] || 0) + obtenerValor(reserva);
        });

        return Object.entries(agrupados).map(
            ([mes, ingresos]) => ({
                mes,
                ingresos,
            })
        );
    }, [reservasConfirmadas]);

    const datosCanchas = useMemo(() => {
        const agrupados = {};

        reservas.forEach((reserva) => {
            const nombre = obtenerNombreCancha(reserva);

            agrupados[nombre] =
                (agrupados[nombre] || 0) + 1;
        });

        return Object.entries(agrupados)
            .map(([cancha, cantidad]) => ({
                cancha,
                cantidad,
            }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 8);
    }, [reservas]);

    // --------------------------------------------------
    // PDF
    // --------------------------------------------------

    const generarPDF = () => {
        const doc = new jsPDF();

        const fecha = new Date().toLocaleString("es-CO");

        doc.setFillColor(22, 163, 74);
        doc.rect(0, 0, 210, 35, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("FUTZONE", 20, 17);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Reporte general administrativo", 20, 26);

        doc.setTextColor(40, 40, 40);
        doc.setFontSize(10);
        doc.text(`Generado: ${fecha}`, 20, 45);

        let y = 60;

        const seccion = (titulo) => {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(titulo, 20, y);
            y += 10;
        };

        const linea = (texto) => {
            if (y > 275) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(String(texto), 22, y);
            y += 7;
        };

        seccion("Resumen general");

        linea(`Total de reservas: ${totalReservas}`);
        linea(`Reservas confirmadas: ${reservasConfirmadas.length}`);
        linea(`Reservas pendientes: ${reservasPendientes.length}`);
        linea(`Reservas canceladas: ${reservasCanceladas.length}`);
        linea(`Canchas registradas: ${canchas.length}`);
        linea(`Sedes registradas: ${sedes.length}`);
        linea(`Usuarios registrados: ${usuarios.length}`);
        linea(`Pagos registrados: ${pagos.length}`);
        linea(`Torneos registrados: ${torneos.length}`);
        linea(`Promociones registradas: ${promociones.length}`);
        linea(`Publicaciones registradas: ${publicaciones.length}`);

        y += 5;
        seccion("Indicadores");

        linea(`Tasa de confirmacion: ${tasaConfirmacion}%`);
        linea(`Tasa de cancelacion: ${tasaCancelacion}%`);
        linea(
            `Valor de reservas confirmadas: ${FORMATO_PESO.format(
                ingresosConfirmados
            )}`
        );

        y += 5;
        seccion("Reservas");

        reservas.forEach((r) => {
            linea(
                `${obtenerNombreUsuario(r)} | ${obtenerNombreCancha(r)} | ${formatearFecha(obtenerFecha(r))} | ${obtenerEstado(r)} | ${FORMATO_PESO.format(obtenerValor(r))}`
            );
        });

        y += 5;
        seccion("Torneos");

        torneos.forEach((t) => {
            linea(`${t.nombre || "Torneo"} - ${t.estado || "Sin estado"}`);
        });

        doc.save("Reporte-General-FutZone.pdf");
    };

    // --------------------------------------------------
    // COMPONENTES VISUALES
    // --------------------------------------------------

    const Tarjeta = ({
        titulo,
        valor,
        descripcion,
        icono: Icono,
        color,
    }) => (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {titulo}
                    </p>

                    <h3 className="text-3xl font-bold text-slate-800 mt-2">
                        {valor}
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                        {descripcion}
                    </p>
                </div>

                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                        backgroundColor: `${color}18`,
                        color,
                    }}
                >
                    <Icono size={23} />
                </div>
            </div>
        </div>
    );

    const TituloSeccion = ({ titulo, descripcion }) => (
        <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">
                {titulo}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {descripcion}
            </p>
        </div>
    );

    const Estado = ({ estado }) => {
        const valor = String(estado || "Sin estado").toLowerCase();

        const estilos = {
            confirmada: "bg-green-100 text-green-700",
            confirmado: "bg-green-100 text-green-700",
            pendiente: "bg-yellow-100 text-yellow-700",
            cancelada: "bg-red-100 text-red-700",
            cancelado: "bg-red-100 text-red-700",
            activo: "bg-green-100 text-green-700",
            finalizado: "bg-gray-100 text-gray-700",
            "en curso": "bg-blue-100 text-blue-700",
        };

        return (
            <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    estilos[valor] || "bg-slate-100 text-slate-600"
                }`}
            >
                {estado || "Sin estado"}
            </span>
        );
    };

    // --------------------------------------------------
    // INTERFAZ
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-7 text-slate-800">

            {/* ENCABEZADO */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                <div>
                    <div className="flex items-center gap-2 text-green-700 text-sm font-semibold mb-2">
                        <FaChartLine />
                        CENTRO DE INTELIGENCIA FUTZONE
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                        Reportes generales
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Control y análisis de toda la plataforma deportiva.
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                        {actualizado
                            ? `Última actualización: ${actualizado.toLocaleString("es-CO")}`
                            : "Esperando información del servidor..."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={cargarReportes}
                        disabled={cargando}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 font-semibold shadow-sm disabled:opacity-50"
                    >
                        <FaSyncAlt className={cargando ? "animate-spin" : ""} />
                        Actualizar
                    </button>

                    <button
                        onClick={generarPDF}
                        disabled={cargando}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/20 disabled:opacity-50"
                    >
                        <FaFilePdf />
                        Exportar PDF
                    </button>
                </div>
            </div>

            {/* AVISO DE CARGA */}

            {cargando && (
                <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <FaSyncAlt className="animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">
                        Consultando información de FutZone...
                    </span>
                </div>
            )}

            {/* ERRORES DE CONEXIÓN */}

            {Object.keys(errores).length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-2 items-center font-semibold text-amber-800">
                        <FaExclamationTriangle />
                        Algunas secciones no están disponibles
                    </div>

                    <p className="text-sm text-amber-700 mt-2">
                        Revisa las rutas del backend Django. Las secciones
                        sin conexión no se contabilizan.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {Object.entries(errores).map(([nombre, error]) => (
                            <span
                                key={nombre}
                                className="bg-white border border-amber-200 rounded-lg px-3 py-1 text-xs text-amber-800"
                            >
                                {nombre}: {error}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* TARJETAS PRINCIPALES */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                <Tarjeta
                    titulo="Reservas"
                    valor={totalReservas}
                    descripcion="Registros encontrados"
                    icono={FaCalendarCheck}
                    color={COLORES.verde}
                />

                <Tarjeta
                    titulo="Usuarios"
                    valor={usuarios.length}
                    descripcion="Usuarios registrados"
                    icono={FaUsers}
                    color={COLORES.azul}
                />

                <Tarjeta
                    titulo="Canchas"
                    valor={canchas.length}
                    descripcion="Canchas registradas"
                    icono={FaFutbol}
                    color={COLORES.verde}
                />

                <Tarjeta
                    titulo="Ingresos confirmados"
                    valor={FORMATO_PESO.format(ingresosConfirmados)}
                    descripcion="Valor de reservas confirmadas"
                    icono={FaMoneyBillWave}
                    color={COLORES.morado}
                />

                <Tarjeta
                    titulo="Sedes"
                    valor={sedes.length}
                    descripcion="Sedes registradas"
                    icono={FaBuilding}
                    color={COLORES.naranja}
                />

                <Tarjeta
                    titulo="Pagos"
                    valor={pagos.length}
                    descripcion="Registros de pagos"
                    icono={FaCreditCard}
                    color={COLORES.azul}
                />

                <Tarjeta
                    titulo="Torneos"
                    valor={torneos.length}
                    descripcion={`${torneosActivos} torneos activos`}
                    icono={FaTrophy}
                    color={COLORES.morado}
                />

                <Tarjeta
                    titulo="Promociones"
                    valor={promociones.length}
                    descripcion="Promociones registradas"
                    icono={FaBullhorn}
                    color={COLORES.naranja}
                />
            </div>

            {/* SEGUNDO GRUPO */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">

                <Tarjeta
                    titulo="Publicaciones"
                    valor={publicaciones.length}
                    descripcion="Contenido publicado"
                    icono={FaNewspaper}
                    color={COLORES.azul}
                />

                <Tarjeta
                    titulo="Equipos inscritos"
                    valor={totalEquipos}
                    descripcion="Equipos asociados a torneos"
                    icono={FaUsers}
                    color={COLORES.morado}
                />

                <Tarjeta
                    titulo="Plataforma"
                    valor="Conectada"
                    descripcion="Panel administrativo FutZone"
                    icono={FaCheckCircle}
                    color={COLORES.verde}
                />
            </div>

            {/* ESTADOS DE RESERVAS */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-8">

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm xl:col-span-2">
                    <TituloSeccion
                        titulo="Comportamiento de las reservas"
                        descripcion="Distribución según el estado de cada reserva."
                    />

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosEstados}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
                                <XAxis dataKey="estado" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="cantidad"
                                    name="Reservas"
                                    radius={[8, 8, 0, 0]}
                                >
                                    {datosEstados.map((item) => (
                                        <Cell
                                            key={item.estado}
                                            fill={item.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <TituloSeccion
                        titulo="Distribución"
                        descripcion="Participación por estado."
                    />

                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={datosEstados}
                                    dataKey="cantidad"
                                    nameKey="estado"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                >
                                    {datosEstados.map((item) => (
                                        <Cell
                                            key={item.estado}
                                            fill={item.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* INGRESOS */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
                <TituloSeccion
                    titulo="Ingresos por mes"
                    descripcion="Valor asociado a reservas confirmadas, agrupado por fecha."
                />

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={datosIngresos}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />
                            <XAxis dataKey="mes" />
                            <YAxis
                                tickFormatter={(valor) =>
                                    `$${Number(valor).toLocaleString("es-CO")}`
                                }
                            />
                            <Tooltip
                                formatter={(valor) =>
                                    FORMATO_PESO.format(Number(valor))
                                }
                            />
                            <Bar
                                dataKey="ingresos"
                                name="Valor confirmado"
                                fill={COLORES.verde}
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CANCHAS MÁS RESERVADAS */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
                <TituloSeccion
                    titulo="Canchas más reservadas"
                    descripcion="Ranking de canchas según el número de reservas."
                />

                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={datosCanchas}
                            layout="vertical"
                            margin={{ left: 15, right: 25 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="cancha"
                                width={130}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="cantidad"
                                name="Reservas"
                                fill={COLORES.azul}
                                radius={[0, 8, 8, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TORNEOS */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
                <div className="p-6">
                    <TituloSeccion
                        titulo="Torneos registrados"
                        descripcion="Información general de las competiciones."
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-4 text-left">Torneo</th>
                                <th className="p-4 text-center">Tipo</th>
                                <th className="p-4 text-center">Equipos</th>
                                <th className="p-4 text-center">Inicio</th>
                                <th className="p-4 text-center">Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {torneos.map((torneo, index) => (
                                <tr
                                    key={torneo.id || torneo.id_torneo || index}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="p-4 font-semibold">
                                        {torneo.nombre || "Sin nombre"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {torneo.tipo || "-"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {Array.isArray(torneo.equipos)
                                            ? torneo.equipos.length
                                            : torneo.total_equipos || 0}
                                    </td>
                                    <td className="p-4 text-center">
                                        {formatearFecha(
                                            torneo.fechaInicio ||
                                            torneo.fecha_inicio
                                        )}
                                    </td>
                                    <td className="p-4 text-center">
                                        <Estado estado={torneo.estado} />
                                    </td>
                                </tr>
                            ))}

                            {torneos.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="p-8 text-center text-gray-400"
                                    >
                                        No hay torneos disponibles o el
                                        endpoint todavía no está configurado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RESERVAS */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6 overflow-hidden">
                <div className="p-6">
                    <TituloSeccion
                        titulo="Registro de reservas"
                        descripcion="Detalle de las reservas consultadas desde Django."
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-white">
                            <tr>
                                <th className="p-4 text-left">Usuario</th>
                                <th className="p-4 text-left">Cancha</th>
                                <th className="p-4 text-center">Fecha</th>
                                <th className="p-4 text-center">Hora</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-right">Valor</th>
                            </tr>
                        </thead>

                        <tbody>
                            {reservas.map((reserva, index) => (
                                <tr
                                    key={
                                        reserva.id_reserva ||
                                        reserva.id ||
                                        index
                                    }
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="p-4 font-medium">
                                        {obtenerNombreUsuario(reserva)}
                                    </td>

                                    <td className="p-4">
                                        {obtenerNombreCancha(reserva)}
                                    </td>

                                    <td className="p-4 text-center">
                                        {formatearFecha(
                                            obtenerFecha(reserva)
                                        )}
                                    </td>

                                    <td className="p-4 text-center">
                                        {obtenerHora(reserva)}
                                    </td>

                                    <td className="p-4 text-center">
                                        <Estado estado={reserva.estado} />
                                    </td>

                                    <td className="p-4 text-right font-semibold">
                                        {FORMATO_PESO.format(
                                            obtenerValor(reserva)
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {reservas.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-8 text-center text-gray-400"
                                    >
                                        No hay reservas disponibles.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* INDICADORES */}

            <div className="mt-8">
                <TituloSeccion
                    titulo="Indicadores de rendimiento"
                    descripcion="Métricas generales de la operación de FutZone."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 font-medium">
                                Tasa de confirmación
                            </p>
                            <FaCheckCircle className="text-green-600 text-2xl" />
                        </div>

                        <h3 className="text-4xl font-black text-green-600 mt-3">
                            {tasaConfirmacion}%
                        </h3>

                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${tasaConfirmacion}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 font-medium">
                                Tasa de cancelación
                            </p>
                            <FaTimesCircle className="text-red-600 text-2xl" />
                        </div>

                        <h3 className="text-4xl font-black text-red-600 mt-3">
                            {tasaCancelacion}%
                        </h3>

                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                            <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${tasaCancelacion}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border-l-4 border-yellow-500 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 font-medium">
                                Reservas pendientes
                            </p>
                            <FaClock className="text-yellow-600 text-2xl" />
                        </div>

                        <h3 className="text-4xl font-black text-yellow-600 mt-3">
                            {reservasPendientes.length}
                        </h3>

                        <p className="text-xs text-gray-400 mt-4">
                            Reservas que requieren atención.
                        </p>
                    </div>
                </div>
            </div>

            {/* PIE DE PÁGINA */}

            <div className="mt-8 p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <p className="font-bold flex items-center gap-2">
                        <FaFutbol className="text-green-400" />
                        FutZone | Administración
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Centro de reportes y estadísticas generales.
                    </p>
                </div>

                <p className="text-xs text-slate-400">
                    Datos consultados desde el backend Django.
                </p>
            </div>
        </div>
    );
}
