
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

const API_RESERVAS = "http://127.0.0.1:8000/api/reservas/";
const API_USUARIOS = "http://127.0.0.1:8000/api/usuarios/";
const API_CANCHAS = "http://127.0.0.1:8000/api/canchas/";

export default function PagoModal({
    mostrarModal,
    setMostrarModal,
    formulario,
    setFormulario,
    pagos,
    setPagos,
}) {
    const [reservas, setReservas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const generarReferencia = () => {
        const fecha = new Date();
        const codigo = Math.floor(1000 + Math.random() * 9000);

        return `FTZ-${fecha.getFullYear()}${String(
            fecha.getMonth() + 1
        ).padStart(2, "0")}${String(
            fecha.getDate()
        ).padStart(2, "0")}-${codigo}`;
    };

    // Cargar reservas, usuarios y canchas desde Django
    useEffect(() => {
        if (!mostrarModal) return;

        const cargarDatos = async () => {
            setCargando(true);
            setError("");

            try {
                const [resRes, resUsu, resCan] = await Promise.all([
                    fetch(API_RESERVAS),
                    fetch(API_USUARIOS),
                    fetch(API_CANCHAS),
                ]);

                if (!resRes.ok || !resUsu.ok || !resCan.ok) {
                    throw new Error(
                        "No se pudieron consultar los datos. Verifica las rutas de Django."
                    );
                }

                const [datosRes, datosUsu, datosCan] =
                    await Promise.all([
                        resRes.json(),
                        resUsu.json(),
                        resCan.json(),
                    ]);

                const listaReservas = Array.isArray(datosRes)
                    ? datosRes
                    : datosRes.results || [];

                const listaUsuarios = Array.isArray(datosUsu)
                    ? datosUsu
                    : datosUsu.results || [];

                const listaCanchas = Array.isArray(datosCan)
                    ? datosCan
                    : datosCan.results || [];

                setReservas(listaReservas);
                setUsuarios(listaUsuarios);
                setCanchas(listaCanchas);
            } catch (error) {
                console.error("Error cargando reservas:", error);
                setError(
                    "No fue posible cargar las reservas. Comprueba que Django esté ejecutándose."
                );
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [mostrarModal]);

    // Crear referencia al abrir el formulario
    useEffect(() => {
        if (mostrarModal && !formulario.referenciaSistema) {
            setFormulario((prev) => ({
                ...prev,
                referenciaSistema: generarReferencia(),
            }));
        }
    }, [mostrarModal, formulario.referenciaSistema, setFormulario]);

    // Obtener cliente relacionado con una reserva
    const obtenerCliente = (reserva) => {
        const usuarioRelacionado =
            reserva.usuario ??
            reserva.id_usuario ??
            reserva.cliente;

        if (usuarioRelacionado && typeof usuarioRelacionado === "object") {
            return (
                usuarioRelacionado.nombre_completo ||
                usuarioRelacionado.nombre ||
                usuarioRelacionado.username ||
                usuarioRelacionado.email ||
                "Cliente"
            );
        }

        const usuario = usuarios.find(
            (u) =>
                String(u.id_usuario ?? u.id) ===
                String(usuarioRelacionado)
        );

        return usuario
            ? usuario.nombre_completo ||
                  usuario.nombre ||
                  usuario.username ||
                  usuario.email ||
                  "Cliente"
            : "Cliente";
    };

    // Obtener cancha relacionada con una reserva
    const obtenerCancha = (reserva) => {
        const canchaRelacionada =
            reserva.cancha ??
            reserva.id_cancha;

        if (canchaRelacionada && typeof canchaRelacionada === "object") {
            return (
                canchaRelacionada.nombre_cancha ||
                canchaRelacionada.nombre ||
                "Cancha"
            );
        }

        const cancha = canchas.find(
            (c) =>
                String(c.id_cancha ?? c.id) ===
                String(canchaRelacionada)
        );

        return cancha
            ? cancha.nombre_cancha || cancha.nombre || "Cancha"
            : "Cancha";
    };

    const obtenerValor = (reserva) => {
        const canchaRelacionada =
            reserva.cancha && typeof reserva.cancha === "object"
                ? reserva.cancha
                : canchas.find(
                      (c) =>
                          String(c.id_cancha ?? c.id) ===
                          String(reserva.id_cancha)
                  );

        return Number(
            reserva.total ??
            reserva.precio_total ??
            reserva.valor_total ??
            reserva.valor ??
            canchaRelacionada?.precio_hora ??
            canchaRelacionada?.precio ??
            canchaRelacionada?.precio_por_hora ??
            0
        );
    };

    const obtenerFecha = (reserva) => {
        return (
            reserva.fecha_reserva ||
            reserva.fecha ||
            ""
        );
    };

    const obtenerIdReserva = (reserva) => {
        return reserva.id_reserva ?? reserva.id;
    };

    const seleccionarReserva = (id) => {
        const reserva = reservas.find(
            (r) => String(obtenerIdReserva(r)) === String(id)
        );

        if (!reserva) {
            setFormulario((prev) => ({
                ...prev,
                idReserva: "",
                cliente: "",
                cancha: "",
                valor: 0,
                fecha: "",
            }));
            return;
        }

        setFormulario((prev) => ({
            ...prev,
            idReserva: obtenerIdReserva(reserva),
            cliente: obtenerCliente(reserva),
            cancha: obtenerCancha(reserva),
            valor: obtenerValor(reserva),
            fecha: obtenerFecha(reserva),
        }));
    };

    const cargarComprobante = (e) => {
        const archivo = e.target.files?.[0];

        if (!archivo) return;

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "application/pdf",
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            alert("Solo se permiten archivos JPG, PNG o PDF.");
            e.target.value = "";
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            alert("El archivo no puede superar los 5 MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setFormulario((prev) => ({
                ...prev,
                comprobante: reader.result,
            }));
        };

        reader.readAsDataURL(archivo);
    };

    const guardarPago = () => {
        if (!formulario.idReserva) {
            alert("Selecciona una reserva.");
            return;
        }

        if (
            formulario.metodo === "Nequi" &&
            !formulario.comprobante
        ) {
            alert("Adjunta el comprobante de Nequi.");
            return;
        }

        if (
            formulario.metodo === "Nequi" &&
            !formulario.referenciaNequi.trim()
        ) {
            alert("Escribe la referencia de la transacción de Nequi.");
            return;
        }

        const nuevoPago = {
            ...formulario,
            estado:
                formulario.metodo === "Nequi"
                    ? "Pendiente"
                    : "Pagado",
            id: Date.now(),
            fechaRegistro: new Date().toISOString(),
        };

        const nuevosPagos = [...pagos, nuevoPago];

        setPagos(nuevosPagos);

        // Temporal: el pago todavía se almacena en localStorage.
        localStorage.setItem("pagos", JSON.stringify(nuevosPagos));

        alert(
            formulario.metodo === "Nequi"
                ? "Comprobante registrado. El pago está pendiente de verificación."
                : "Pago registrado."
        );

        setMostrarModal(false);
    };

    if (!mostrarModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 text-gray-700">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-6 bg-green-600 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Registrar Pago
                    </h2>

                    <button
                        type="button"
                        onClick={() => setMostrarModal(false)}
                    >
                        <FaTimes size={22} />
                    </button>
                </div>

                <div className="p-6">
                    <label className="font-semibold">
                        Reserva
                    </label>

                    <select
                        value={formulario.idReserva || ""}
                        onChange={(e) =>
                            seleccionarReserva(e.target.value)
                        }
                        className="w-full border rounded-xl p-3 mt-2 mb-4"
                        disabled={cargando}
                    >
                        <option value="">
                            {cargando
                                ? "Cargando reservas..."
                                : "Seleccione una reserva"}
                        </option>

                        {reservas.map((r) => (
                            <option
                                key={obtenerIdReserva(r)}
                                value={obtenerIdReserva(r)}
                            >
                                Reserva #{obtenerIdReserva(r)} —{" "}
                                {obtenerCliente(r)} —{" "}
                                {obtenerCancha(r)}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <p className="text-red-600 mb-4">
                            {error}
                        </p>
                    )}

                    {!cargando && !error && reservas.length === 0 && (
                        <p className="text-amber-700 mb-4">
                            No se encontraron reservas en Django.
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label>Cliente</label>
                            <input
                                readOnly
                                value={formulario.cliente || ""}
                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label>Cancha</label>
                            <input
                                readOnly
                                value={formulario.cancha || ""}
                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label>Valor</label>
                            <input
                                readOnly
                                value={`$${Number(
                                    formulario.valor || 0
                                ).toLocaleString("es-CO")}`}
                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
                            />
                        </div>

                        <div>
                            <label>Fecha de reserva</label>
                            <input
                                readOnly
                                value={formulario.fecha || ""}
                                className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="font-semibold text-lg">
                            Método de Pago
                        </label>

                        <div className="flex gap-10 mt-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={formulario.metodo === "Efectivo"}
                                    onChange={() =>
                                        setFormulario((prev) => ({
                                            ...prev,
                                            metodo: "Efectivo",
                                        }))
                                    }
                                />
                                Efectivo
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    checked={formulario.metodo === "Nequi"}
                                    onChange={() =>
                                        setFormulario((prev) => ({
                                            ...prev,
                                            metodo: "Nequi",
                                        }))
                                    }
                                />
                                Nequi
                            </label>
                        </div>
                    </div>

                    {formulario.metodo === "Nequi" && (
                        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
                            <h3 className="text-2xl font-bold text-green-700 mb-5">
                                Pago por Nequi
                            </h3>

                            <div className="flex justify-center">
                                <Image
                                    src="/images/qr.webp"
                                    width={250}
                                    height={250}
                                    alt="QR Nequi"
                                    className="rounded-xl shadow"
                                />
                            </div>

                            <div className="mt-6 space-y-3">
                                <p>
                                    <strong>Número Nequi:</strong>{" "}
                                    3106021273
                                </p>

                                <p>
                                    <strong>Valor a pagar:</strong>{" "}
                                    ${Number(
                                        formulario.valor || 0
                                    ).toLocaleString("es-CO")}
                                </p>

                                <p>
                                    <strong>Referencia FutZone:</strong>{" "}
                                    <span className="text-green-700 font-bold">
                                        {formulario.referenciaSistema}
                                    </span>
                                </p>
                            </div>

                            <div className="mt-6">
                                <label className="font-semibold">
                                    Referencia que aparece en Nequi
                                </label>

                                <input
                                    type="text"
                                    value={formulario.referenciaNequi || ""}
                                    onChange={(e) =>
                                        setFormulario((prev) => ({
                                            ...prev,
                                            referenciaNequi: e.target.value,
                                        }))
                                    }
                                    placeholder="Ej: 985632147"
                                    className="w-full border rounded-xl p-3 mt-2"
                                />
                            </div>

                            <div className="mt-6">
                                <label className="font-semibold">
                                    Adjuntar comprobante
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={cargarComprobante}
                                    className="mt-3 block w-full"
                                />
                            </div>

                            {formulario.comprobante && (
                                <div className="mt-6">
                                    <p className="font-semibold mb-3">
                                        Vista previa
                                    </p>

                                    {formulario.comprobante.startsWith(
                                        "data:image"
                                    ) ? (
                                        <img
                                            src={formulario.comprobante}
                                            alt="Comprobante"
                                            className="max-w-full w-[250px] rounded-xl border"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-xl p-4">
                                            PDF cargado correctamente.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t p-6 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => setMostrarModal(false)}
                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={guardarPago}
                        disabled={cargando || reservas.length === 0}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
                    >
                        {formulario.metodo === "Nequi"
                            ? "Enviar comprobante"
                            : "Registrar Pago"}
                    </button>
                </div>
            </div>
        </div>
    );
}
