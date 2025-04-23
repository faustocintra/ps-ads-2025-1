import express from 'express';
import controller from '../controllers/sellers.js';

const router = express.Router();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.recuperarUm);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

export default router;
