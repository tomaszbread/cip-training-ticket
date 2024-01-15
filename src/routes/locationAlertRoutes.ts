
import express from 'express';
import LocationAlertController from '../controllers/locationAlertController';
import RedisConfig from '../config/redisConfig';

const locationAlertRouter = express.Router();

const configureLocationAlertRoutes = (redisConfig: RedisConfig) => {
  const locationAlertController = new LocationAlertController(redisConfig);

  locationAlertRouter.get('/getLocationAlert', locationAlertController.getLocationAlert);

  return locationAlertRouter;
};

export default configureLocationAlertRoutes;