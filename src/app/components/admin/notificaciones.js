
export const notificacionesIniciales = [
    {
        id: 1,
        tipo: "reserva",
        titulo: "Nueva reserva",
        mensaje: "Se ha realizado una nueva reserva de cancha.",
        tiempo: "Hace 10 minutos",
        icono: "CalendarCheck",
        leida: false
    },
    {
        id: 2,
        tipo: "usuario",
        titulo: "Nuevo usuario registrado",
        mensaje: "Un nuevo usuario se ha registrado en FutZone.",
        tiempo: "Hace 30 minutos",
        icono: "UserPlus",
        leida: false
    },
    {
        id: 3,
        tipo: "pago",
        titulo: "Nuevo pago recibido",
        mensaje: "Se ha registrado un nuevo pago por una reserva.",
        tiempo: "Hace 1 hora",
        icono: "CreditCard",
        leida: true
    },
    {
        id: 4,
        tipo: "alerta",
        titulo: "Reserva cancelada",
        mensaje: "Una reserva ha sido cancelada por el usuario.",
        tiempo: "Hace 2 horas",
        icono: "AlertTriangle",
        leida: true
    }
];