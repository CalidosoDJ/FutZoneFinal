"use client";

import { FaPlus, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function UsuariosComponent() {

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [indice, setIndice] = useState(null);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [editando, setEditando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        usuario: "",
        correo: "",
        celular: "",
        password: "",
        rol: "usuario",
    });
    useEffect(() => {

        const datos =
            JSON.parse(localStorage.getItem("usuarios")) || [];

        setUsuarios(datos);

    }, []);


    //crear usuario
    const guardarUsuario = () => {

        const nuevos = [...usuarios, formulario];

        setUsuarios(nuevos);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(nuevos)
        );
        setFormulario({
            nombre: "",
            usuario: "",
            correo: "",
            celular: "",
            password: "",
            rol: "usuario",
        });

        setMostrarModal(false);

    };

    //eliminar usuario
    const eliminarUsuario = (index) => {

        if (!confirm("¿Eliminar usuario?"))
            return;

        const nuevos = usuarios.filter(
            (_, i) => i !== index
        );

        setUsuarios(nuevos);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(nuevos)
        );

    };

    //editar usuario

    const editarUsuario = (usuario, index) => {

        setFormulario(usuario);

        setIndice(index);

        setEditando(true);

        setMostrarModal(true);

    };

    //actualizar usuario

    const actualizarUsuario = () => {

        const copia = [...usuarios];

        copia[indice] = formulario;

        setUsuarios(copia);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(copia)
        );

        setMostrarModal(false);

        setEditando(false);

    };

    return (

        <div>

            <div className="flex justify-between items-center mb-8 text-gray-700">

                <div className="text-gray-800">

                    <h1 className="text-4xl font-bold">
                        Gestión de Usuarios
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Administra todos los usuarios registrados.
                    </p>

                </div>

                <button type="button" onClick={() => {
                    setFormulario({
                        nombre: "",
                        usuario: "",
                        correo: "",
                        celular: "",
                        password: "",
                        rol: "usuario",
                    });

                    setEditando(false);
                    setMostrarModal(true);

                }}

                    className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    flex
                    items-center
                    gap-2
                    "
                >

                    <FaPlus />

                    Nuevo Usuario

                </button>

            </div>

            {/* Buscador */}

            <div className="bg-white rounded-xl shadow p-4 mb-8 text-gray-700">

                <div className="flex items-center gap-3">

                    <FaSearch className="text-gray-400" />

                    <input className="w-full outline-none" placeholder="Buscar usuario..."
                        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                    />


                </div>

            </div>

            {/* Tabla */}

            <div className="bg-white rounded-xl shadow overflow-hidden text-gray-700">

                <table className="w-full text-center">

                    <thead className="bg-green-600 text-white">

                        <tr>

                            <th className="p-4">Nombre</th>

                            <th>Usuario</th>

                            <th>Correo</th>

                            <th>Celular</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {usuarios
                            .filter((u) =>
                                u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                u.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
                                u.correo.toLowerCase().includes(busqueda.toLowerCase())
                            )
                            .map((u, index) => (

                                <tr
                                    key={index}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4">
                                        {u.nombre}
                                    </td>

                                    <td>
                                        {u.usuario}
                                    </td>

                                    <td>
                                        {u.correo}
                                    </td>

                                    <td>
                                        {u.celular}
                                    </td>



                                    <td>

                                        <div className="flex justify-center gap-3">

                                            <button onClick={() => editarUsuario(u, index)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">

                                                Editar

                                            </button>

                                            <button onClick={() => eliminarUsuario(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">

                                                Eliminar

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                    {
                        mostrarModal && (

                            <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

                                <div className="bg-white rounded-xl p-8 w-[500px]">

                                    <h2 className="text-2xl font-bold mb-6">

                                        {editando ? "Editar Usuario" : "Nuevo Usuario"}

                                    </h2>

                                    <input
                                        placeholder="Nombre"
                                        value={formulario.nombre}
                                        onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                                        className="border p-3 rounded-xl w-full mb-4"
                                    />

                                    <input
                                        placeholder="Usuario"
                                        value={formulario.usuario}
                                        onChange={(e) => setFormulario({ ...formulario, usuario: e.target.value })}
                                        className="border p-3 rounded-xl w-full mb-4"
                                    />

                                    <input
                                        placeholder="Correo"
                                        value={formulario.correo}
                                        onChange={(e) => setFormulario({ ...formulario, correo: e.target.value })}
                                        className="border p-3 rounded-xl w-full mb-4"
                                    />

                                    <input
                                        placeholder="Celular"
                                        value={formulario.celular}
                                        onChange={(e) => setFormulario({ ...formulario, celular: e.target.value })}
                                        className="border p-3 rounded-xl w-full mb-6"
                                    />

                                    <div className="flex justify-end gap-4">

                                        <button
                                            onClick={() => setMostrarModal(false)}
                                            className="px-5 py-3 rounded-xl bg-gray-300"
                                        >

                                            Cancelar

                                        </button>

                                        <button
                                            onClick={editando ? actualizarUsuario : guardarUsuario}
                                            className="px-5 py-3 rounded-xl bg-green-600 text-white"
                                        >

                                            Guardar

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    }

                </table>

            </div>

        </div >

    );
}