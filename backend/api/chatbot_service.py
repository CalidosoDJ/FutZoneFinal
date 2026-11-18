import json
from datetime import date, timedelta
import ollama
from .models import (
    Sede,
    Canchas,
    Reservas,
    Torneos,
    TorneoPartidos,
    Publicaciones,
    ChatbotConocimiento,
    ChatbotConversaciones,
    ChatbotMensajes,
    Usuarios,
)


def construir_contexto_futzone() -> tuple[str, list]:
    hoy = date.today()
    manana = hoy + timedelta(days=1)

    # 1. Información de la sede única
    sede = Sede.objects.first()
    if sede:
        cancel_txt = (
            f"Permitidas hasta {sede.horas_limite_cancelacion} horas antes"
            if sede.permitir_cancelaciones
            else "No permitidas"
        )
        info_sede = (
            f"Nombre: {sede.nombre} ({sede.ciudad}, {sede.departamento})\n"
            f"Dirección: {sede.direccion} | Teléfono: {sede.telefono or 'No registrado'}\n"
            f"Horario de atención: {sede.horario_apertura.strftime('%H:%M')} a {sede.horario_cierre.strftime('%H:%M')}\n"
            f"Política de cancelación: {cancel_txt}"
        )
    else:
        info_sede = "Sede principal FutZone en Popayán."

    # 2. Canchas y precios
    canchas = list(Canchas.objects.select_related('id_tipo').all())
    lista_canchas = "\n".join([
        f"- [ID:{c.id_cancha}] {c.nombre} | Tipo: {c.id_tipo.nombre} | "
        f"Precio: ${c.precio_hora:,.0f}/hora | Estado actual: {c.estado}"
        for c in canchas
    ]) or "No hay canchas registradas."

    # 3. Horarios ocupados por RESERVAS (hoy y mañana)
    reservas = Reservas.objects.filter(
        fecha_reserva__in=[hoy, manana],
        estado__in=['Pendiente', 'Confirmada']
    ).select_related('id_cancha')

    ocupadas_reservas = [
        f"- {r.id_cancha.nombre} ocupada el {r.fecha_reserva} de "
        f"{r.hora_inicio.strftime('%H:%M')} a {r.hora_fin.strftime('%H:%M')} (Reserva {r.estado})"
        for r in reservas
    ]

    # 4. Horarios ocupados por PARTIDOS DE TORNEO (hoy y mañana)
    partidos = TorneoPartidos.objects.filter(
        fecha_partido__in=[hoy, manana],
        estado__in=['Programado', 'En Curso'],
        id_cancha__isnull=False
    ).select_related('id_cancha', 'id_torneo')

    ocupadas_torneos = [
        f"- {p.id_cancha.nombre} ocupada el {p.fecha_partido} a las "
        f"{p.hora_partido.strftime('%H:%M')} por partido del torneo '{p.id_torneo.nombre}'"
        for p in partidos
    ]

    bloqueos = "\n".join(ocupadas_reservas + ocupadas_torneos) or "Todas las horas están libres hoy y mañana."

    # 5. Torneos con inscripciones abiertas
    torneos = Torneos.objects.filter(estado='Inscripciones').select_related('id_tipo')
    lista_torneos = "\n".join([
        f"- {t.nombre} ({t.id_tipo.nombre}): Inscripción ${t.precio_inscripcion:,.0f}, "
        f"máximo {t.equipos_maximos} equipos, inicia el {t.fecha_inicio}"
        for t in torneos
    ]) or "No hay torneos abiertos a inscripción en este momento."

    # 6. Promociones publicadas
    promos = Publicaciones.objects.filter(estado='Publicado', tipo='Promoción')
    lista_promos = "\n".join([
        f"- {p.titulo}: {p.descripcion}"
        for p in promos
    ]) or "Sin promociones activas."

    # 7. Base de conocimiento administrable
    conocimientos = ChatbotConocimiento.objects.filter(activo=1)
    lista_conocimiento = "\n".join([
        f"- [{k.categoria} - {k.intencion}]: {k.respuesta}"
        for k in conocimientos
    ])

    contexto = f"""
FECHA DE HOY: {hoy} (Mañana es {manana})

DATOS DE LA SEDE:
{info_sede}

CANCHAS DE LA SEDE:
{lista_canchas}

HORARIOS YA OCUPADOS (NO OFRECER ESTAS HORAS):
{bloqueos}

TORNEOS DISPONIBLES:
{lista_torneos}

PROMOCIONES VIGENTES:
{lista_promos}

REGLAS Y PREGUNTAS FRECUENTES:
{lista_conocimiento}
"""
    return contexto, canchas


def seleccionar_tarjetas_canchas(texto_bot: str, mensaje_usuario: str, canchas: list) -> list:
    """Detecta si el bot o el usuario hablaron de canchas/precios/reservas y devuelve sus tarjetas."""
    texto_combinado = f"{texto_bot} {mensaje_usuario}".lower()
    palabras_intencion = ["cancha", "reservar", "reserva", "precio", "disponible", "libre", "jugar", "hora", "fútbol", "futbol"]

    # Primero buscamos si el bot mencionó el nombre exacto de alguna cancha
    canchas_mencionadas = [
        c for c in canchas
        if c.nombre.lower() in texto_bot.lower() and c.estado == 'Disponible'
    ]

    # Si no mencionó nombres exactos pero la charla trata de canchas/reservas, mostramos las disponibles (máx. 3)
    if not canchas_mencionadas and any(p in texto_combinado for p in palabras_intencion):
        canchas_mencionadas = [c for c in canchas if c.estado == 'Disponible'][:3]

    return [
        {
            "id_cancha": c.id_cancha,
            "nombre": c.nombre,
            "tipo": c.id_tipo.nombre,
            "precio_hora": float(c.precio_hora),
            "imagen_url": c.imagen_url or "/images/cancha-default.jpg",
        }
        for c in canchas_mencionadas[:3]
    ]


def stream_mensaje_chatbot(mensaje_usuario: str, id_usuario: int = None, id_conversacion: int = None):
    """Generador que transmite los tokens en vivo y al final envía metadata y tarjetas."""
    conversacion = None
    if id_conversacion:
        conversacion = ChatbotConversaciones.objects.filter(id_conversacion=id_conversacion).first()

    if not conversacion:
        usuario_obj = Usuarios.objects.filter(id_usuario=id_usuario).first() if id_usuario else None
        conversacion = ChatbotConversaciones.objects.create(
            id_usuario=usuario_obj,
            estado='Activa'
        )

    # Guardar mensaje del usuario
    ChatbotMensajes.objects.create(
        id_conversacion=conversacion,
        remitente='usuario',
        mensaje=mensaje_usuario,
        leido=1
    )

    # Enviar primero el ID de conversación al frontend
    yield json.dumps({
        "tipo": "meta",
        "id_conversacion": conversacion.id_conversacion
    }) + "\n"

    ultimos_mensajes = list(
        ChatbotMensajes.objects.filter(id_conversacion=conversacion)
        .order_by('-id_mensaje')[:6]
    )[::-1]

    contexto_sql, canchas_db = construir_contexto_futzone()

    system_prompt = (
        "Eres el asistente virtual oficial de FutZone, un complejo de canchas deportivas en Popayán. "
        "Responde de manera cercana, breve y directa en español. "
        "Responde únicamente sobre FutZone, reservas de canchas, horarios, pagos, ubicación y torneos. Si preguntan por otro tema, redirige amablemente hacia nuestros servicios deportivos."
        "Usa ÚNICAMENTE los datos reales proporcionados en el contexto. "
        "Si una cancha aparece en 'HORARIOS YA OCUPADOS' a la hora que pide el cliente, dile que está ocupada "
        "y recomiéndale otra cancha disponible o un horario libre dentro del horario de apertura y cierre. "
        "Si preguntan por temas ajenos al deporte o a FutZone, redirige amablemente hacia nuestras canchas y torneos. "
        "Métodos de pago aceptados: Efectivo, Nequi, Daviplata, Tarjeta y Transferencia.\n\n"
        + contexto_sql
    )

    historial_ollama = [{'role': 'system', 'content': system_prompt}]
    for msg in ultimos_mensajes:
        rol = 'user' if msg.remitente == 'usuario' else 'assistant'
        historial_ollama.append({'role': rol, 'content': msg.mensaje})

    respuesta_completa = ""

    try:
        flujo = ollama.chat(
            model='llama3.2',
            messages=historial_ollama,
            stream=True
        )
        for chunk in flujo:
            pedazo = chunk.get('message', {}).get('content', '')
            if pedazo:
                respuesta_completa += pedazo
                yield json.dumps({
                    "tipo": "token",
                    "contenido": pedazo
                }) + "\n"
    except Exception:
        respuesta_completa = (
            "En este momento estoy teniendo un inconveniente técnico para revisar las canchas. "
            "Por favor intenta nuevamente en unos segundos."
        )
        yield json.dumps({
            "tipo": "token",
            "contenido": respuesta_completa
        }) + "\n"

    # Guardar respuesta completa en MySQL
    ChatbotMensajes.objects.create(
        id_conversacion=conversacion,
        remitente='bot',
        mensaje=respuesta_completa,
        leido=1
    )

    # Enviar tarjetas de canchas recomendadas al final del stream
    tarjetas = seleccionar_tarjetas_canchas(respuesta_completa, mensaje_usuario, canchas_db)
    yield json.dumps({
        "tipo": "fin",
        "tarjetas": tarjetas
    }) + "\n"