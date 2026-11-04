"use client";

import { FaPlus, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function UsuariosComponent() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [indice, setIndice] = useState(null);
    const [cargando, setCargando] = useState(false);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [editando, setEditando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre_completo: "",
        username: "",
        email: "",
        telefono: "",
        password: "",
        id_rol: "2", // Por defecto Jugador (Rol 2)
        categoria_arbitro: "Árbitro Local"
    });

    // 1. Cargar usuarios desde la base de datos (Next.js API)
    const cargarUsuarios = async () => {
        try {
            const res = await fetch("/api/admin/usuarios");
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 2. Crear usuario desde el modal del Admin
    const guardarUsuario = async () => {
        if (!formulario.nombre_completo || !formulario.email || !formulario.password) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        setCargando(true);
        try {
            const respuesta = await fetch("/api/admin/crear-usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formulario),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                alert(datos.message || "Error al crear el usuario");
                setCargando(false);
                return;
            }

            alert("¡Usuario creado exitosamente!");
            cargarUsuarios(); // Recargar la tabla con el nuevo registro de MySQL
            cerrarModal();

        } catch (error) {
            console.error("Error al conectar:", error);
            alert("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    const cerrarModal = () => {
        setFormulario({
            nombre_completo: "",
            username: "",
            email: "",
            telefono: "",
            password: "",
            id_rol: "2",
            categoria_arbitro: "Árbitro Local"
        });
        setMostrarModal(false);
        setEditando(false);
    };

    const editarUsuario = (usuario, index) => {
        setFormulario({
            id_usuario: usuario.id_usuario,
            nombre_completo: usuario.nombre_completo || usuario.nombre || "",
            username: usuario.username || usuario.usuario || "",
            email: usuario.email || usuario.correo || "",
            telefono: usuario.telefono || usuario.celular || "",
            password: "",
            id_rol: String(usuario.id_rol || "2"),
            categoria_arbitro: usuario.categoria_arbitro || "Árbitro Local"
        });
        setIndice(index);
        setEditando(true);
        setMostrarModal(true);
    };

    return (
        <div>
            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-8 text-gray-700">
                <div className="text-gray-800">
                    <h1 className="text-4xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-gray-500 mt-2">
                        Administra todos los usuarios registrados (Admins, Jugadores y Árbitros).
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        cerrarModal();
                        setMostrarModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow transition"
                >
                    <FaPlus />
                    Nuevo Usuario
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="bg-white rounded-xl shadow p-4 mb-8 text-gray-700">
                <div className="flex items-center gap-3">
                    <FaSearch className="text-gray-400" />
                    <input
                        className="w-full outline-none text-black"
                        placeholder="Buscar por nombre, usuario o correo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLA DE USUARIOS */}
            <div className="bg-white rounded-xl shadow overflow-hidden text-gray-700">
                <table className="w-full text-center">
                    <thead className="bg-green-600 text-white font-semibold">
                        <tr>
                            <th className="p-4">Rol</th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Celular</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios
                            .filter((u) => {
                                const q = busqueda.toLowerCase();
                                const nombre = u.nombre_completo || u.nombre || "";
                                const user = u.username || u.usuario || "";
                                const correo = u.email || u.correo || "";
                                return nombre.toLowerCase().includes(q) || user.toLowerCase().includes(q) || correo.toLowerCase().includes(q);
                            })
                            .map((u, index) => (
                                <tr key={u.id_usuario || index} className="border-b hover:bg-gray-50 text-black">
                                    <td className="p-4 font-semibold">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${u.id_rol === 1 ? "bg-red-500" : u.id_rol === 3 ? "bg-amber-500" : "bg-blue-500"
                                            }`}>
                                            {u.id_rol === 1 ? "Admin" : u.id_rol === 3 ? "Árbitro" : "Jugador"}
                                        </span>
                                    </td>
                                    <td>{u.nombre_completo || u.nombre}</td>
                                    <td>{u.username || u.usuario}</td>
                                    <td>{u.email || u.correo}</td>
                                    <td>{u.telefono || u.celular || "N/A"}</td>
                                    <td>
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => editarUsuario(u, index)}
                                                className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL CREAR / EDITAR */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white text-black rounded-2xl p-8 w-[500px] shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">
                            {editando ? "Editar Usuario" : "Nuevo Usuario"}
                        </h2>

                        <div className="space-y-4">
                            {/* Selector de Rol */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                    Rol asignado
                                </label>
                                <select
                                    value={formulario.id_rol}
                                    onChange={(e) => setFormulario({ ...formulario, id_rol: e.target.value })}
                                    className="border border-gray-300 p-3 rounded-xl w-full bg-gray-100 font-medium text-black"
                                >
                                    <option value="1">Administrador (Rol 1)</option>
                                    <option value="2">Jugador (Rol 2)</option>
                                    <option value="3">Árbitro (Rol 3)</option>
                                </select>
                            </div>

                            <input
                                placeholder="Nombre Completo *"
                                value={formulario.nombre_completo}
                                onChange={(e) => setFormulario({ ...formulario, nombre_completo: e.target.value })}
                                className="border border-gray-300 p-3 rounded-xl w-full text-black"
                                required
                            />

                            <input
                                placeholder="Nombre de Usuario (Username) *"
                                value={formulario.username}
                                onChange={(e) => setFormulario({ ...formulario, username: e.target.value })}
                                className="border border-gray-300 p-3 rounded-xl w-full text-black"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Correo Electrónico *"
                                value={formulario.email}
                                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                                className="border border-gray-300 p-3 rounded-xl w-full text-black"
                                required
                            />

                            <input
                                type="password"
                                placeholder={editando ? "Nueva Contraseña (Opcional)" : "Contraseña *"}
                                value={formulario.password}
                                onChange={(e) => setFormulario({ ...formulario, password: e.target.value })}
                                className="border border-gray-300 p-3 rounded-xl w-full text-black"
                            />

                            <input
                                type="tel"
                                placeholder="Teléfono / Celular"
                                value={formulario.telefono}
                                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                                className="border border-gray-300 p-3 rounded-xl w-full text-black"
                            />

                            {/* Campo condicional para Árbitros */}
                            {formulario.id_rol === "3" && (
                                <input
                                    placeholder="Categoría del Árbitro (Ej: Principal, Asistente)"
                                    value={formulario.categoria_arbitro}
                                    onChange={(e) => setFormulario({ ...formulario, categoria_arbitro: e.target.value })}
                                    className="border border-gray-300 p-3 rounded-xl w-full text-black"
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={cerrarModal}
                                className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                disabled={cargando}
                                onClick={guardarUsuario}
                                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold"
                            >
                                {cargando ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}