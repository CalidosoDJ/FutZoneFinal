"use client";

import { useEffect, useState } from "react";
import { UserCircle, Mail, Phone, User, Shield, Pencil, Save, X } from "lucide-react";

export default function AdminPerfil() {

    const [usuario, setUsuario] = useState(null);
    const [editando, setEditando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        usuario: "",
        correo: "",
        celular: ""
    });

    // Cargar administrador
    useEffect(() => {

        const usuarioGuardado =
            localStorage.getItem("usuarioLogueado");

        if (usuarioGuardado) {

            const datos = JSON.parse(usuarioGuardado);

            setUsuario(datos);

            setFormulario({
                nombre: datos.nombre || "",
                usuario: datos.usuario || "",
                correo: datos.correo || "",
                celular: datos.celular || ""
            });
        }

    }, []);


    // Cambiar datos del formulario
    const manejarCambio = (e) => {

        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });

    };


    // Guardar cambios
    const guardarCambios = () => {

        const datosActualizados = {
            ...usuario,
            nombre: formulario.nombre,
            usuario: formulario.usuario,
            correo: formulario.correo,
            celular: formulario.celular
        };

        // Actualizar administrador
        localStorage.setItem(
            "admin",
            JSON.stringify(datosActualizados)
        );

        // Actualizar usuario logueado
        localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(datosActualizados)
        );

        setUsuario(datosActualizados);

        setEditando(false);

        alert("Perfil actualizado correctamente");

    };


    if (!usuario) {

        return (
            <div className="flex justify-center items-center h-64">

                <p className="text-gray-500">
                    Cargando perfil...
                </p>

            </div>
        );

    }


    return (

        <div className="max-w-5xl mx-auto">

            {/* ENCABEZADO */}

            <div className="mb-4">

                <h1 className="text-3xl font-bold text-gray-800">
                    Mi Perfil
                </h1>

                <p className="text-gray-500 mt-1">
                    Administra la información de tu cuenta
                </p>

            </div>


            {/* TARJETA PRINCIPAL */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* CABECERA VERDE */}

                <div className="h-20 bg-gradient-to-r from-green-600 to-green-500"></div>


                {/* INFORMACIÓN PRINCIPAL */}

                <div className="px-8 pb-8">

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 mb-8">

                        {/* FOTO */}

                        <div className="flex items-end gap-5">

                            <div className="bg-white p-2 rounded-full shadow">

                                <UserCircle
                                    size={85}
                                    className="text-green-600"
                                />

                            </div>

                            <div className="pb-2">

                                <h2 className="text-2xl font-bold text-gray-800">
                                    {usuario.nombre}
                                </h2>

                                <p className="text-gray-500">
                                    Administrador de FutZone
                                </p>

                            </div>

                        </div>


                        {/* BOTONES */}

                        <div className="flex gap-3 mt-5 md:mt-0">

                            {!editando ? (

                                <button
                                    onClick={() => setEditando(true)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition"
                                >

                                    <Pencil size={17} />

                                    Editar perfil

                                </button>

                            ) : (

                                <>

                                    <button
                                        onClick={guardarCambios}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl transition"
                                    >

                                        <Save size={17} />

                                        Guardar

                                    </button>


                                    <button
                                        onClick={() => setEditando(false)}
                                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl transition"
                                    >

                                        <X size={17} />

                                        Cancelar

                                    </button>

                                </>

                            )}

                        </div>

                    </div>


                    {/* DATOS */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                        {/* NOMBRE */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <User
                                    size={20}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-500">
                                    Nombre completo
                                </span>

                            </div>

                            {editando ? (

                                <input
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-gray-800"
                                />

                            ) : (

                                <p className="font-semibold text-gray-800">
                                    {usuario.nombre}
                                </p>

                            )}

                        </div>


                        {/* USUARIO */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <UserCircle
                                    size={20}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-500">
                                    Nombre de usuario
                                </span>

                            </div>

                            {editando ? (

                                <input
                                    name="usuario"
                                    value={formulario.usuario}
                                    onChange={manejarCambio}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-gray-800"
                                />

                            ) : (

                                <p className="font-semibold text-gray-800">
                                    {usuario.usuario}
                                </p>

                            )}

                        </div>


                        {/* CORREO */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Mail
                                    size={20}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-500">
                                    Correo electrónico
                                </span>

                            </div>

                            {editando ? (

                                <input
                                    type="email"
                                    name="correo"
                                    value={formulario.correo}
                                    onChange={manejarCambio}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-gray-800"
                                />

                            ) : (

                                <p className="font-semibold text-gray-800">
                                    {usuario.correo}
                                </p>

                            )}

                        </div>


                        {/* CELULAR */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Phone
                                    size={20}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-500">
                                    Número celular
                                </span>

                            </div>

                            {editando ? (

                                <input
                                    type="tel"
                                    name="celular"
                                    value={formulario.celular}
                                    onChange={manejarCambio}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-green-500 text-gray-800"
                                />

                            ) : (

                                <p className="font-semibold text-gray-800">
                                    {usuario.celular || "No registrado"}
                                </p>

                            )}

                        </div>


                        {/* ROL */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Shield
                                    size={20}
                                    className="text-green-600"
                                />

                                <span className="text-sm text-gray-500">
                                    Rol
                                </span>

                            </div>

                            <p className="font-semibold text-gray-800">
                                Administrador
                            </p>

                        </div>


                        {/* ESTADO */}

                        <div className="border border-gray-200 rounded-xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>

                                <span className="text-sm text-gray-500">
                                    Estado de cuenta
                                </span>

                            </div>

                            <p className="font-semibold text-green-600">
                                Activa
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}