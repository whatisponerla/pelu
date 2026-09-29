# Reglas de Negocio

## RN-01
Un horario solo puede pertenecer a un cliente. No se permiten reservas duplicadas.

## RN-02
El teléfono identifica al cliente. Si existe, se reutiliza su registro.

## RN-03
El email es opcional y se almacena pensando en futuras notificaciones.

## RN-04
No existen usuarios registrados: no hay usuario, contraseña ni login para clientes.

## RN-05
El frontend puede guardar nombre, teléfono y email en LocalStorage para autocompletar futuros formularios.

## RN-06
La base de datos es la fuente de verdad. Nunca confiar únicamente en LocalStorage o datos del frontend.

## RN-07
Antes de crear un turno debe verificarse nuevamente la disponibilidad.

## RN-08
Los horarios vencidos no deben mostrarse como disponibles.

## RN-09
La creación de cliente y turno debe realizarse como una operación lógica:
1. Buscar cliente.
2. Crear cliente si no existe.
3. Crear turno.
4. Confirmar reserva.

## RN-10
Estados previstos: Disponible, Reservado, Confirmado, Cancelado, Atendido y Ausente.
