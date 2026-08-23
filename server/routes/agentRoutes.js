import { Router } from 'express';
import { getAgents, getAgentById } from '../controllers/agentController.js';

const router = Router();

// Public Agent Endpoints
router.get('/', getAgents);
router.get('/:id', getAgentById);

export default router;
