import express from 'express';
import LocationAlertController from '../controllers/locationAlertController';

const locationAlertRouter = express.Router();
const locationAlertController = new LocationAlertController();

locationAlertRouter.get('/getLocationAlert', locationAlertController.getLocationAlert);

export default locationAlertRouter;