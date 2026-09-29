import { Router } from 'express';
import { getClienteByTelefono, createCliente } from '../controllers/clientes.controller.js';

const router = Router();

router.get('/telefono/:telefono', getClienteByTelefono);
router.post('/', createCliente);

export default router;
