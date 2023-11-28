import express from 'express';
import { getLocationAlerts, createLocationAlert } from '../controllers/locationAlertController';

const router = express.Router();

router.get('/', getLocationAlerts);
router.post('/', createLocationAlert);

export default router;