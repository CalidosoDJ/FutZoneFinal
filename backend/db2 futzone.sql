-- ============================================================
-- SCRIPT COMPLETO CON RELACIONES PARA MODELADO EN MYSQL
-- ============================================================

-- 1. TABLA DE ROLES
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. TABLA DE USUARIOS
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL DEFAULT 2,
    nombre_completo VARCHAR(150) NOT NULL,
    username VARCHAR(50) UNIQUE NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    foto_url VARCHAR(255) NULL,
    estado ENUM('activo', 'inactivo', 'bloqueado') DEFAULT 'activo',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. TABLA DE SEDE
CREATE TABLE sede (
    id_sede INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL DEFAULT 'FutZone',
    ciudad VARCHAR(100) NOT NULL DEFAULT 'Popayán',
    departamento VARCHAR(100) NOT NULL DEFAULT 'Cauca',
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NULL,
    correo VARCHAR(100) DEFAULT 'admin@futzone.com',
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    permitir_cancelaciones BOOLEAN DEFAULT TRUE,
    horas_limite_cancelacion INT DEFAULT 2,
    notif_nuevas_reservas BOOLEAN DEFAULT TRUE,
    notif_cancelaciones BOOLEAN DEFAULT TRUE,
    notif_pagos BOOLEAN DEFAULT TRUE,
    notif_nuevos_torneos BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 4. TIPOS DE CANCHA Y CANCHAS
CREATE TABLE tipos_cancha (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE canchas (
    id_cancha INT AUTO_INCREMENT PRIMARY KEY,
    id_sede INT NOT NULL DEFAULT 1,
    id_tipo INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio_hora DECIMAL(10, 2) NOT NULL,
    estado ENUM('Disponible', 'Mantenimiento', 'Ocupada') DEFAULT 'Disponible',
    CONSTRAINT fk_canchas_sede FOREIGN KEY (id_sede) REFERENCES sede(id_sede) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_canchas_tipos FOREIGN KEY (id_tipo) REFERENCES tipos_cancha(id_tipo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. RESERVAS Y PAGOS
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_cancha INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('Pendiente', 'Confirmada', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservas_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservas_cancha FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Nequi', 'Daviplata', 'Tarjeta', 'Transferencia') NOT NULL,
    comprobante_url VARCHAR(255) NULL,
    estado ENUM('Pendiente', 'Pagado', 'Rechazado') DEFAULT 'Pendiente',
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagos_reserva FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. MÓDULO DE TORNEOS
CREATE TABLE torneos (
    id_torneo INT AUTO_INCREMENT PRIMARY KEY,
    id_tipo INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    precio_inscripcion DECIMAL(10, 2) NOT NULL,
    equipos_maximos INT NOT NULL DEFAULT 8,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    estado ENUM('Inscripciones', 'Activo', 'Finalizado', 'Cancelado') DEFAULT 'Inscripciones',
    CONSTRAINT fk_torneos_tipocancha FOREIGN KEY (id_tipo) REFERENCES tipos_cancha(id_tipo) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE torneo_equipos (
    id_equipo INT AUTO_INCREMENT PRIMARY KEY,
    id_torneo INT NOT NULL,
    id_capitan INT NOT NULL,
    nombre_equipo VARCHAR(100) NOT NULL,
    estado_pago ENUM('Pendiente', 'Completado') DEFAULT 'Pendiente',
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_equipos_torneo FOREIGN KEY (id_torneo) REFERENCES torneos(id_torneo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_equipos_capitan FOREIGN KEY (id_capitan) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE torneo_partidos (
    id_partido INT AUTO_INCREMENT PRIMARY KEY,
    id_torneo INT NOT NULL,
    id_equipo_local INT NOT NULL,
    id_equipo_visitante INT NOT NULL,
    id_cancha INT NULL,
    fecha_partido DATE NOT NULL,
    hora_partido TIME NOT NULL,
    goles_local INT DEFAULT 0,
    goles_visitante INT DEFAULT 0,
    fase VARCHAR(50) DEFAULT 'Fase de Grupos',
    estado ENUM('Programado', 'En Curso', 'Finalizado', 'Cancelado') DEFAULT 'Programado',
    CONSTRAINT fk_partidos_torneo FOREIGN KEY (id_torneo) REFERENCES torneos(id_torneo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_partidos_eq_local FOREIGN KEY (id_equipo_local) REFERENCES torneo_equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_partidos_eq_visitante FOREIGN KEY (id_equipo_visitante) REFERENCES torneo_equipos(id_equipo) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_partidos_cancha FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. MÓDULO DE PUBLICACIONES
CREATE TABLE publicaciones (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo ENUM('Noticia', 'Promoción') NOT NULL DEFAULT 'Promoción',
    imagen_url VARCHAR(255) NULL,
    fecha_publicacion DATE NOT NULL,
    estado ENUM('Publicado', 'Borrador', 'Inactivo') NOT NULL DEFAULT 'Publicado',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. MÓDULO DE ÁRBITRO
CREATE TABLE perfil_arbitro (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    categoria VARCHAR(50) DEFAULT 'Árbitro Local',
    calificacion DECIMAL(3,2) DEFAULT 5.00,
    partidos_dirigidos INT DEFAULT 0,
    disponible BOOLEAN DEFAULT TRUE,
    fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_perfil_arbitro_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE arbitro_partidos (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_arbitro INT NOT NULL,
    num_partido VARCHAR(20) NOT NULL,
    equipo_local VARCHAR(100) NOT NULL,
    equipo_visitante VARCHAR(100) NOT NULL,
    sede VARCHAR(150) NOT NULL,
    fecha_partido DATE NOT NULL,
    hora_partido TIME NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Libre',
    estado ENUM('Pendiente', 'En Curso', 'Finalizado', 'Cancelado') DEFAULT 'Pendiente',
    CONSTRAINT fk_arbitro_partidos_usuario FOREIGN KEY (id_usuario_arbitro) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE arbitro_partido_resumen (
    id_resumen INT AUTO_INCREMENT PRIMARY KEY,
    id_asignacion INT NOT NULL UNIQUE,
    goles_local INT DEFAULT 0,
    goles_visitante INT DEFAULT 0,
    observaciones TEXT NULL,
    calificacion_partido INT DEFAULT 5,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resumen_asignacion FOREIGN KEY (id_asignacion) REFERENCES arbitro_partidos(id_asignacion) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE arbitro_partido_eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_resumen INT NOT NULL,
    minuto INT NOT NULL,
    tipo_evento ENUM('Gol', 'Tarjeta Amarilla', 'Tarjeta Roja', 'Sustitucion', 'Otro') NOT NULL,
    equipo ENUM('Local', 'Visitante') NOT NULL,
    jugador_nombre VARCHAR(100) NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT fk_eventos_resumen FOREIGN KEY (id_resumen) REFERENCES arbitro_partido_resumen(id_resumen) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 9. NOTIFICACIONES
CREATE TABLE notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo ENUM('reserva', 'recordatorio', 'promocion', 'novedad', 'sistema', 'partido') DEFAULT 'reserva',
    id_referencia INT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificaciones_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- pruebas
-- 1. Insertar Roles
INSERT INTO roles (id_rol, nombre) VALUES 
(1, 'Administrador'), (2, 'Jugador'), (3, 'Árbitro')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. Insertar Usuarios de Prueba (Admin, Jugador, Árbitro)
INSERT INTO usuarios (id_usuario, id_rol, nombre_completo, username, email, password_hash, telefono) VALUES
(1, 1, 'Carlos Admin', 'admin', 'admin@futzone.com', 'hash_123', '3001234567'),
(2, 2, 'Juan Jugador', 'jjugador', 'juan@gmail.com', 'hash_123', '3109876543'),
(3, 3, 'Carlos Pérez', 'cperez', 'carlos.perez@futzone.com', 'hash_123', '3204567890');

-- 3. Insertar Perfil del Árbitro
INSERT INTO perfil_arbitro (id_usuario, categoria, calificacion, partidos_dirigidos, disponible) VALUES
(3, 'Árbitro Nacional', 4.9, 125, TRUE);

-- 4. Insertar Tipos de Cancha y Cancha
INSERT INTO tipos_cancha (id_tipo, nombre) VALUES (1, 'Fútbol 5'), (2, 'Fútbol 8');

INSERT INTO canchas (id_cancha, id_sede, id_tipo, nombre, precio_hora, estado) VALUES
(1, 1, 1, 'Cancha Sintética 1', 60000.00, 'Disponible');


-- consultas
-- Intento de asignar un partido a un usuario que NO existe (Ej: id_usuario = 999)
INSERT INTO arbitro_partidos (id_usuario_arbitro, num_partido, equipo_local, equipo_visitante, sede, fecha_partido, hora_partido) 
VALUES (999, 'Partido #99', 'A', 'B', 'Sede', CURDATE(), '10:00:00');


INSERT INTO reservas (id_reserva, id_usuario, id_cancha, fecha_reserva, hora_inicio, hora_fin, total, estado) VALUES
(1, 2, 1, CURDATE(), '18:00:00', '19:00:00', 60000.00, 'Confirmada');

-- 6. Asignar Partido al Árbitro
INSERT INTO arbitro_partidos (id_asignacion, id_usuario_arbitro, num_partido, equipo_local, equipo_visitante, sede, fecha_partido, hora_partido, categoria, estado) VALUES
(1, 3, 'Partido #25', 'Atlético FC', 'Juventus', 'FutZone Norte', CURDATE(), '18:00:00', 'Sub-20', 'Pendiente');

-- chatbot
-- 1. BASE DE CONOCIMIENTO (Para configurar y "entrenar" las respuestas)
CREATE TABLE chatbot_conocimiento (
    id_conocimiento INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL,             -- Ej: 'Reserva', 'Pagos', 'Ubicación'
    intencion VARCHAR(100) NOT NULL,            -- Ej: 'metodos_pago', 'horarios'
    palabras_clave TEXT NOT NULL,               -- Ej: 'pago, daviplata, nequi, tarjeta, transferir'
    respuesta TEXT NOT NULL,                    -- Texto explicativo que dará el bot
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB;

-- 2. HISTORIAL DE CONVERSACIONES
CREATE TABLE chatbot_conversaciones (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,                         -- NULL si navega un visitante sin login
    estado ENUM('Activa', 'Cerrada') DEFAULT 'Activa',
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. MENSAJES INDIVIDUALES (Alimenta la burbuja del chat)
CREATE TABLE chatbot_mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_conversacion INT NOT NULL,
    remitente ENUM('bot', 'usuario') NOT NULL,    -- Identifica de quién es la burbuja
    mensaje TEXT NOT NULL,                        -- Contenido del texto
    leido BOOLEAN DEFAULT FALSE,                 -- Para los checks verdes (✓✓)
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversacion) REFERENCES chatbot_conversaciones(id_conversacion) ON DELETE CASCADE
) ENGINE=InnoDB;








