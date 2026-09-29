-- Schema SQL para Peluquería Turnos
CREATE DATABASE IF NOT EXISTS peluqueria_turnos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peluqueria_turnos;

-- Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(100) NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla turnos
CREATE TABLE IF NOT EXISTS turnos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Reservado', -- Reservado, Confirmado, Cancelado, Atendido, Ausente
  observaciones TEXT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Datos iniciales de demostración
INSERT INTO clientes (nombre, telefono, email) VALUES 
('Juan Pérez', '1122334455', 'juan@example.com'),
('María Gómez', '1199887766', 'maria@example.com')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO turnos (cliente_id, fecha_hora, estado, observaciones) VALUES
(1, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), 'Reservado', 'Corte de pelo y barba'),
(2, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 2 DAY), 'Confirmado', 'Tinte y peinado')
ON DUPLICATE KEY UPDATE id=id;
