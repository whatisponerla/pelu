import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientesRoutes from './routes/clientes.routes.js';
import turnosRoutes from './routes/turnos.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de API REST (según 06-API.md)
app.use('/clientes', clientesRoutes);
app.use('/turnos', turnosRoutes);

// Ruta base de estado
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API REST Sistema de Turnos de Peluquería v0.1 operativa'
  });
});

// Iniciar Servidor Express
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
