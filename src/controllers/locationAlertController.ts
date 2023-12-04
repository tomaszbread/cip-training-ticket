import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
import RedisConfig from '../config/redisConfig';

class LocationAlertController {
    private locationAlertService: LocationAlertService
    private redisConfig: RedisConfig

  constructor() {
    this.locationAlertService = new LocationAlertService();
    this.redisConfig = new RedisConfig();
  }

 public getLocationAlerts(req: Request, res: Response): void {
    const alerts: LocationAlert[] = [
      {
        id: '1',
        userId: 'admin',
        latitude: 40.7128, 
        longitude: -74.0060 ,
        message: 'local admin',
        timestamp: new Date(),
      } as LocationAlert,
    ];
    res.json(alerts);
  }

  public createLocationAlert(req: Request, res: Response): void {
    const newAlert: LocationAlert = this.locationAlertService.generateRandomLocationAlert();
    this.publishToLocationAlertStream(newAlert);
    //res.json(newAlert);
  }

  public publishToLocationAlertStream(alert: LocationAlert): void {
    const streamAlert = JSON.stringify(alert);
    this.redisConfig.redisClient.xAdd('location-alert-stream', alert.timestamp.toString(), { streamAlert });
  }
}

export default LocationAlertController;