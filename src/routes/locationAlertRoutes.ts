import express from 'express';
import LocationAlertController from '../controllers/locationAlertController';

const router = express.Router();
const locationAlertController = new LocationAlertController();

router.get('/', locationAlertController.getLocationAlerts);
router.post('/', locationAlertController.createLocationAlert);

export default router;