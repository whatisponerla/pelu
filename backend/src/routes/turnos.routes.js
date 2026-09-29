import { Router } from 'express';
import {
  getTurnosDisponibles,
  getTurnos,
  createTurno,
  updateTurno,
  deleteTurno
} from '../controllers/turnos.controller.js';

const router = Router();

router.get('/disponibles', getTurnosDisponibles);
router.get('/', getTurnos);
router.post('/', createTurno);
router.put('/:id', updateTurno);
router.delete('/:id', deleteTurno);

export default router;
